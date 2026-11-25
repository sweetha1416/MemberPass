# MemberPass – Premium AI-Powered Membership Management

**A smarter way to manage memberships.**

## 🌐 Live Demo & Repository

- **Live Website:** https://member-pass-psi.vercel.app/
- **GitHub Repository:** https://github.com/sweetha1416/MemberPass
- **Project Drive:** https://drive.google.com/file/d/11nW79ZUdcOa7IDWZXaMWA7gHmg-vu8A4/view?usp=sharing
- **AI Assistant Demo:** https://drive.google.com/file/d/1fE0dK_WYZGUPuKz4V554H17JqjZujUlv/view?usp=sharing

---

## 📌 About the Project

**MemberPass** is a web-based membership management platform engineered for **Thendral Yoga Loft, Coimbatore** (developed as part of the Vizdale Full-Stack Developer Internship). 

The platform simplifies and modernizes membership operations, integrating membership tier subscriptions, test-mode payment processing, attendance tracking, cryptographic QR-based studio check-in, self-service membership pause, automated expiry notifications, and intelligent AI assistance into a unified SaaS application.

MemberPass provides a seamless, dignified digital experience for both yoga practitioners and studio front-desk administrators.

---

## 🎯 Project Objectives

- **Simplify Membership Management:** Centralize member subscriptions, privilege tiers, and profile information.
- **Provide a User-Friendly Digital Experience:** Responsive Mediterranean Burgundy editorial interface for mobile and desktop.
- **Integrate AI-Powered Assistance:** Hybrid Q&A assistant supporting live status lookups and domain queries.
- **Enable Secure Payments:** Razorpay checkout flow with signature verification and webhook processing.
- **Track Attendance & Class Usage:** Optical QR check-in terminal with atomic class deduction and daily idempotency.
- **Automate Expiry Management:** Scheduled background jobs for membership pause resumption and 3-day expiry alerts.
- **Protect Member Privacy:** Confidential check-in records with strict authentication boundaries and zero cross-member exposure.

---

## ✨ Key Features

- **Membership Management** – Manage member accounts, membership tiers, validity dates, and account standing.
- **Multiple Membership Tiers** – 
  - *Basic Plan*: ₹1,500 / 30 Days (8 studio classes)
  - *Standard Plan*: ₹3,000 / 30 Days (25 studio classes)
  - *Premium Plan*: ₹7,500 / 90 Days (Unlimited studio sessions)
- **Razorpay Payment Integration** – Secure test checkout, client-side signature verification, and server-side webhook fulfillment.
- **QR-Based Check-In** – Instant front-desk validation via camera scanner or manual pass code entry.
- **Class Usage Tracking & Limit Enforcement** – Real-time tracking of classes used/remaining with atomic enforcement preventing concurrency bypass.
- **Self-Service Membership Pause** – Members can pause an active pass once per calendar year (1–15 days) with automatic expiry date extension.
- **Automated Expiry & Background Jobs** – Scheduled routines managing daily pause resumption and email reminder dispatch.
- **AI Member Assistant** – Dedicated AI Assistant page with contextual intent routing and dynamic query handling.
- **AI Absentee Drafts** – Staff tool generating personalized re-engagement drafts for inactive practitioners (14, 30, 60, or 90 days).
- **Member Dashboard** – Real-time access to digital QR pass, pass key, class utilization, transaction ledger, and personal attendance history.
- **Staff / Admin Console** – Camera check-in terminal, manual code entry, membership validation, attendance audit log, and manual expiry trigger.

---

## 🛠️ Technologies Used

- **Frontend:** React 19, Vite, JavaScript (ES6+), Vanilla CSS (Custom Design System)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens) with role-based access control (`member`, `staff`, `admin`)
- **Payment Gateway:** Razorpay API (Test Mode & Webhooks)
- **AI Service:** PyTorch GRU-based sequence model (`memberpass-ai`), FastAPI, Python 3.13 (with Node.js rule/context fallback)
- **Scheduling:** Node.js interval background jobs (`node-cron` compatible)
- **Deployment:** Vercel (Frontend), Render (Backend)
- **Version Control:** Git & GitHub

---

## 📚 Milestone Documentation (docs/)

Detailed engineering and audit documentation is available in the [`docs/`](docs/) directory:

- [**docs/AI_NOTES.md**](docs/AI_NOTES.md) – Source-verified documentation of the PyTorch GRU AI architecture, FastAPI microservice, backend intent routing, and environment verification status.
- [**docs/TEST_REPORT.md**](docs/TEST_REPORT.md) – Comprehensive test audit report distinguishing previously reported regression results (76/76 passed) from pending/unverified live runs.
- [**docs/PROGRESS.md**](docs/PROGRESS.md) – Milestone-by-milestone implementation summary tracking M1 through M4.
- [**docs/DEMO_SCRIPT.md**](docs/DEMO_SCRIPT.md) – Step-by-step evaluator demonstration script covering both practitioner and staff workflows.

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/sweetha1416/MemberPass.git
cd MemberPass
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Configure `frontend/.env` (optional, defaults to local or production fallback):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Backend Setup

In a new terminal window:
```bash
cd backend
npm install
```

Configure `backend/.env` with the verified environment variable names:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/memberpass
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
AI_SERVICE_URL=http://127.0.0.1:8000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_app_password
EMAIL_FROM="MemberPass <noreply@memberpass.com>"
STAFF_EMAIL=staff@example.com
STAFF_PASSWORD=your_staff_password
```

Start the backend server:
```bash
npm run dev
```

### 4. Optional: Python AI Microservice Setup (`memberpass-ai`)

> **Note on AI Environment Status:** The Python AI service environment and its runtime execution have not been successfully verified in all local environments. If the Python microservice is not running, the Node.js backend automatically provides intelligent domain responses and context-aware fallbacks without interrupting user operations.

To run the local PyTorch AI service:
```bash
cd memberpass-ai
python -m venv .venv
# Activate virtual environment (Windows: .venv\Scripts\activate | Unix: source .venv/bin/activate)
pip install torch fastapi uvicorn pydantic
uvicorn server:app --host 127.0.0.1 --port 8000
```

---

## 🔗 Project Links

- **Live Website:** https://member-pass-psi.vercel.app/
- **GitHub Repository:** https://github.com/sweetha1416/MemberPass

---

## 👨‍💻 Project Status

MemberPass has completed **M1** (Foundations), **M2** (Core Membership & QR Verification), **M3** (Security Hardening, Automation & AI Assistant), and **M4** (Documentation Verification & Quality Audit).

---

**MemberPass – Smarter Membership. Better Experiences.**
