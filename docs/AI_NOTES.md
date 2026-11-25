# MemberPass – AI Architecture & Implementation Notes

This document provides a technical overview of the AI and conversational assistance implementation in **MemberPass**, based strictly on source code inspection of `memberpass-ai` and `backend/routes/aiRoutes.js`.

---

## 1. System Architecture Overview

MemberPass uses a **two-layer hybrid architecture** for member inquiries:

```
[ User Browser / Client ]
            │
            ▼  POST /api/ai/chat
[ Node.js / Express Backend (backend/routes/aiRoutes.js) ]
            │
            ├─► 1. Authenticated Database Lookup (MongoDB: User, Membership, Attendance, Plan)
            │      • Returns verified live membership telemetry, attendance count, expiry dates
            │
            ├─► 2. Domain Intent Handlers (Pattern matching for policies, pauses, privacy, studio hours)
            │
            ├─► 3. External AI Microservice Call (HTTP fetch to AI_SERVICE_URL, timeout: 4s)
            │            │
            │            ▼
            │     [ Python / FastAPI Microservice (memberpass-ai/server.py) ]
            │     [ Custom PyTorch GRU Model (memberpass-ai/models/model.py) ]
            │
            └─► 4. Resilient Fallback Engine (Triggered if Python service is offline or unreachable)
```

---

## 2. Python AI Service Architecture (`memberpass-ai`)

### 2.1 Model Architecture (`models/model.py`)

The neural model is implemented in PyTorch (`models/model.py`) under the class name `MemberPassGPT`:

- **Model Type:** Custom PyTorch Recurrent Neural Network (GRU-based Sequence-to-Sequence / Autoregressive architecture).
- **No Foundation/External Model:** This is a custom lightweight model trained locally from scratch; it does **not** use a pretrained foundation model (such as GPT-3/4, LLaMA, BERT, Gemini, or Claude).
- **Layer Breakdown:**
  1. **Embedding Layer:** `nn.Embedding(vocab_size, embedding_dim=128)`
     - Maps discrete token IDs to 128-dimensional continuous vector representations.
  2. **Recurrent Layer (GRU):** `nn.GRU(embedding_dim=128, hidden_dim=256, batch_first=True)`
     - Single-layer Gated Recurrent Unit with a hidden state dimension of 256.
     - Sequences are processed with `batch_first=True`.
  3. **Linear Projection Head:** `nn.Linear(hidden_dim=256, vocab_size)`
     - Projects the 256-dimensional GRU output back to the vocabulary space to produce logits for next-token prediction.

```python
# Inspected definition in memberpass-ai/models/model.py
import torch
import torch.nn as nn

class MemberPassGPT(nn.Module):
    def __init__(self, vocab_size, embedding_dim=128, hidden_dim=256):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.gru = nn.GRU(embedding_dim, hidden_dim, batch_first=True)
        self.output = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x):
        embedded = self.embedding(x)
        output, _ = self.gru(embedded)
        return self.output(output)
```

### 2.2 Serving & Inference Pipeline (`server.py`)

- **Web Framework:** FastAPI (v1.0.0) hosted via Uvicorn.
- **Device Placement:** `DEVICE = "cpu"`.
- **Checkpoint Loading:** Loads `checkpoints/memberpass_model.pth` using `torch.load(CHECKPOINT, map_location="cpu", weights_only=True)`.
  - The checkpoint contains:
    - `vocab`: Token-to-ID mapping dictionary (including special tokens `<BOS>`, `<EOS>`, `<PAD>`, `<UNK>`).
    - `embedding_dim`: 128
    - `hidden_dim`: 256
    - `model_state_dict`: Learned weights and biases.
- **Tokenization:** Word-level regex tokenization:
  ```python
  def tokenize(text):
      return re.findall(r"\w+|[^\w\s]", text.lower())
  ```
- **Inference Decoding Loop:**
  - Input is framed with `["<BOS>"] + tokens + ["<EOS>"]`.
  - Iterative greedy decoding (`torch.argmax(logits[0, -1])`) up to `max_new_tokens=100`.
  - Terminating conditions: generation of `<EOS>`, `<PAD>`, `<BOS>`, or reaching the token limit.
  - Detokenization: joins tokens with space and cleans punctuation spacing.

### 2.3 Endpoints

- `GET /`: Health status returning `{"success": true, "message": "MemberPass AI API is running"}`.
- `GET /health`: Returns `{"success": true, "model_loaded": true, "device": "cpu"}`.
- `POST /chat`: Accepts `ChatRequest(question: str)` (1 to 500 characters) and returns generated answer string.

---

## 3. Node.js Backend Routing & Intent Handling (`backend/routes/aiRoutes.js`)

The Node.js backend handles `POST /api/ai/chat` with optional JWT authentication (`optionalAuth`). Before calling any neural service, it checks for high-priority operational queries to deliver deterministic, accurate, database-verified answers:

| Intent Category | Triggers / Keywords | Data Source / Behavior |
| :--- | :--- | :--- |
| **Membership Status** | `"status"`, `"my status"`, `"membership status"` | Queries MongoDB `Membership` and `Plan`. Returns real-time standing (`ACTIVE`, `PAUSED`, `ENDED`), attended count, validity end date. |
| **Class Attendance** | `"classes attended"`, `"how many classes"`, `"used"`, `"remaining"` | Counts total check-ins in `Attendance` model. Computes classes remaining against `plan.classLimit`. |
| **Expiry & Validity** | `"expire"`, `"expiry"`, `"end date"`, `"valid until"` | Computes days remaining from `membership.endDate` and presents formatted date. |
| **Plan Pricing & Tiers** | `"membership plans"`, `"pricing"`, `"cost"`, `"tiers"` | Queries active `Plan` documents. Formats Basic (₹1,500 / 8 classes), Standard (₹3,000 / 25 classes), and Premium (₹7,500 / Unlimited). |
| **Membership Pause Policy** | `"pause"`, `"freeze"`, `"hold"`, `"suspend"` | Details self-service pause rules: 1–15 days, once per calendar year, automatic expiry extension. |
| **Attendance Privacy** | `"privacy"`, `"confidential"`, `"who is attending"` | Explains zero cross-member visibility and cryptographic pass key protection. |
| **Renewals** | `"renew"`, `"extend"`, `"continue membership"` | Directs practitioners to the plan checkout workflow via Razorpay test mode. |
| **Payments & Invoicing** | `"payment"`, `"receipt"`, `"invoice"`, `"razorpay"` | Details transaction ledger access in dashboard and Razorpay signature verification. |
| **Studio Hours & Support** | `"support"`, `"contact"`, `"hours"`, `"front desk"` | Reports operating hours: Monday–Sunday 06:00–21:00 IST and front-desk assistance. |

### 3.1 External AI Delegation & Fallback Mechanism

If the inquiry is not handled by the deterministic database queries above:
1. The backend issues an HTTP POST request to `${AI_SERVICE_URL}/chat` (default: `http://127.0.0.1:8000`).
2. A strict 4000ms timeout is enforced using `AbortSignal.timeout(4000)`.
3. If the microservice responds with a non-empty answer, it is returned directly to the client.
4. **Resilient Fallback:** If the connection is refused, times out, or the Python service is not running, the catch block triggers a contextual fallback response providing tailored guidance on MemberPass features without throwing a 500 error to the user.

---

## 4. Verification Status & Known Limitations

1. **Python AI Service Environment Execution:**
   - **Honest Status:** The Python AI service environment and runtime execution have **not been successfully verified** in live testing.
   - Running the microservice requires Python with PyTorch (`torch`), FastAPI, and Uvicorn installed in a compatible environment.
   - Checkpoint compatibility depends on PyTorch serialization formats and Python version parity (compiled with Python 3.13 bytecode in `__pycache__`).
2. **Model Capacity & Domain Scope:**
   - The custom GRU model has an embedding dimension of 128 and hidden dimension of 256 (~1.3 MB checkpoint file `memberpass_model.pth`).
   - It is trained on a small, curated set of question-answer pairs (`memberpass-ai/data/memberpass_qa.jsonl`).
   - It is designed strictly for domain-specific studio Q&A and does not possess general-purpose language reasoning.
3. **Absence of External Providers:**
   - No external commercial APIs (e.g. OpenAI API, Anthropic Claude, Google Gemini API, Groq, or Hugging Face Inference) are connected or configured in the source code.
   - All AI claims in marketing or UI must accurately reflect this local architecture.
