# MemberPass – Quality Assurance & Test Verification Report

This document records the verification status, automated testing history, and outstanding validation boundaries for the **MemberPass** project.

---

## 1. Executive Summary & Testing Policy

- **Testing Methodology:** Verification combines automated unit/regression scripts, API boundary mocks, code analysis, and build checks.
- **Strict Distinction Policy:** In accordance with audit instructions, this report explicitly distinguishes **previously reported automated test results** from tests that were **not executed** or **not verified** during this audit.
- **Safety Boundaries Observed:** No destructive database scripts, live financial transactions, live email dispatches, or seed scripts were executed during this verification cycle.

---

## 2. Previously Reported Automated Regression Suites (76/76 Tests)

The following suites represent **previously reported regression results** in the project record. They are documented here as historical test artifacts and were not freshly executed against production:

### 2.1 Phase 2 Fixes Verification Suite (`backend/scripts/test-phase2-fixes.js`)
- **Reported Result:** **21 / 21 Passed (0 Failed)**
- **Coverage Areas:**
  - **Attendance Model & Safeguards:** Verified `getIndiaDateKey` calculation (UTC + 5.5 hours IST date key offset) preventing duplicate day check-ins across timezone boundaries.
  - **Class Limit & Unlimited Plans:** Verified that plans with `classLimit: 0` or `classLimit: null` (Unlimited Tier) are not incorrectly flagged as exhausted.
  - **AI Route Claims & Integrity:** Verified removal of unsupported marketing assertions (removal of ISO 27001 claim, salted 256-bit cryptographic keys claim, and 1-day support turnaround SLA claim). Verified accurate representation of payment activation via webhooks and 1–15 day pause policy once per calendar year.
  - **Absentee Message Generation:** Verified that generated drafts are explicitly tagged with `source: 'template'` when AI microservice is not active.
  - **Staff Security:** Verified that `createStaff.js` reads credentials from `STAFF_EMAIL` and `STAFF_PASSWORD`, enforces passwords in production, and never prints credentials to console.
  - **Frontend Integrity:** Verified that `PlansSection.jsx` and `App.jsx` consistently show **8 classes** for the Basic plan (correcting prior 10-class mismatch).

### 2.2 QR Check-in & Class-Limit Suite (`backend/scripts/test-qr-classlimit-suite.js`)
- **Reported Result:** **20 / 20 Passed (0 Failed)**
- **Coverage Areas:**
  - **Staff Authorization:** Middleware rejects `member` role (403 Forbidden) and permits `staff` and `admin`.
  - **QR Pass Validation:** Rejects missing pass codes, unrecognised codes, paused passes (403 `Plan paused`), and expired passes (403 `Plan ended`).
  - **Check-in Logic:** Atomic increment of `classesUsed` on valid check-in; duplicate check-in on the same calendar day returns `ENTRY_ALLOWED` without deducting an additional class.
  - **Atomic Rollback:** Simulated database write failure on Attendance record triggers rollback (decrementing `classesUsed` by 1).
  - **Class Limit Enforcement:** Basic plan strictly blocks 9th class attempt; Standard plan strictly blocks 26th class attempt; concurrency filter `{ $lt: limit }` prevents race condition bypass.

### 2.3 Razorpay Payment & Webhook Suite (`backend/scripts/test-razorpay-suite.js`)
- **Reported Result:** **35 / 35 Passed (0 Failed)**
- **Coverage Areas:**
  - **Order Creation:** Validates input parameters, verifies plan existence, rejects malformed IDs.
  - **Payment Verification:** Validates HMAC-SHA256 signature, validates payment record state (`created`), enforces idempotency for already-captured payments.
  - **Webhook Processing:** 
    - Enforces raw Buffer body preservation via `express.raw({ type: '*/*' })`.
    - Rejects invalid HMAC-SHA256 signatures (`X-Razorpay-Signature`).
    - Handles `payment.captured` event to activate membership, set validity dates, and deactivate prior passes.
    - Idempotency guard: duplicate `eventId` returns HTTP 200 without duplicate database mutations.

---

## 3. Live API HTTP Test Suite Status (`backend/scripts/test-live-api.js`)

- **Code Fix Applied:** The script `backend/scripts/test-live-api.js` was previously patched to correctly resolve configuration paths, load environment variables, configure route mounts, and set up test assertions.
- **Execution Status: NOT RUN / UNVERIFIED WITH LIVE DATABASE.**
- **Clarification:** While the script's code was fixed, its execution against a live database **has not been verified** and is **not claimed as passed**. Running this script requires active database connection and generates live records, which were intentionally omitted to maintain database safety during this documentation audit.

---

## 4. Frontend Production Build Verification

- **Command:** `npm --prefix frontend run build`
- **Tooling:** Vite v8.3.6
- **Status:** **Verified Successful (0 Errors)**
- **Artifacts Generated:**
  - HTML: `dist/index.html` (2.83 kB)
  - CSS: `dist/assets/index-DiQDzK08.css` (81.70 kB) – containing all updated Mediterranean Burgundy SaaS design tokens, member dashboard cards, staff dashboard layouts, and AI assistant styles.
  - JavaScript bundles: Clean code-splitting for `AuthModal`, `QRPassModal`, `AIAssistantPage`, `MemberDashboard`, `StaffDashboard`, and vendor chunks.

---

## 5. Synthetic & Test Data Confirmation

Based on source documentation in `docs/PLAN.pdf` and `docs/PLAN 2.pdf`:

- **Confirmed Synthetic Data:**
  - 20 sample member profiles with varied membership standings (`active`, `paused`, `ended`, `none`).
  - Standard plan tiers (Basic, Standard, Premium).
  - Razorpay test keys (`rzp_test_*`) with simulated order IDs and mock webhook payloads.
  - Test attendance logs and simulated check-in IDs (`chk_*`).
  - The "Real User Log" in `docs/PLAN 2.pdf` is explicitly confirmed by its header as an **illustrative sample template**, not genuine production user feedback.
- **Confirmed Boundary:** No real customer credit cards, live banking transactions, or actual member PII were used in testing.

---

## 6. Manual Verification & Pending Tasks

The following validation tasks remain unverified or pending live execution:

| Task / Component | Current Status | Notes / Prerequisites |
| :--- | :--- | :--- |
| **Real MongoDB Live Write Verification** | Pending | Requires running live integration scripts against a non-production test cluster. |
| **Live Payment Capture on Razorpay** | Pending | Tested in mock/unit sandbox; live checkout requires real Razorpay test keys and active browser session. |
| **Live SMTP Email Notification Dispatch** | Pending | Tested in test harness; live delivery depends on external SMTP credentials (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`). |
| **Python PyTorch AI Microservice Execution** | Unverified | Environment not verified; running `server.py` requires Python 3.13 + PyTorch environment. Node.js backend handles queries via internal fallback. |
| **End-User Practice Usability Testing** | Pending | Synthetic log exists in `PLAN 2.pdf`; live sessions with external yoga practitioners remain pending. |
