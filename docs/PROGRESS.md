# MemberPass – Milestone Implementation Progress (M1–M4)

This document outlines the development lifecycle and milestone achievements of the **MemberPass** platform, built for **Thendral Yoga Loft, Coimbatore** during the **Vizdale Full-Stack Developer Internship**.

---

## 📅 Milestone Summary Matrix

| Milestone | Title | Focus Area | Status | Key Deliverables |
| :---: | :--- | :--- | :---: | :--- |
| **M1** | Foundations & Planning | Architecture, Scope & Planning | **Completed** | 1-Page Plan (`PLAN.pdf`), Sample User Log template (`PLAN 2.pdf`), Tech stack selection. |
| **M2** | Core Membership & Passes | Auth, Passes & Payments | **Completed** | JWT authentication, Razorpay test checkout, Optical QR generation, Staff scanner, Attendance logs. |
| **M3** | Hardening & Automation | Webhooks, Pause, Cron & AI | **Completed** | Raw webhook HMAC validation, Self-service pause (1–15d), Daily expiry jobs, PyTorch AI service integration, Dedicated AI page. |
| **M4** | Final Audit & Documentation | Quality Audit, URLs & Docs | **Completed** | URL verification (`member-pass-psi.vercel.app`), M4 documentation suite, Test reporting (76/76 previously reported), Production build verification. |

---

## 🏛️ Milestone 1 (M1) – Foundations, Planning & Schema Design

- **Client & Context:** Thendral Yoga Loft, Coimbatore; problem statement focused on simplifying membership enrollment, pass management, and front-desk check-in bottlenecks.
- **Project Planning Artifacts:**
  - `docs/PLAN.pdf`: Established the 5 core user journeys:
    1. Account creation and secure sign-in.
    2. Exploring and comparing membership plans.
    3. Selecting a plan, completing registration, and activating digital membership.
    4. Viewing QR membership pass, checking expiry, and requesting plan pause.
    5. Front-desk staff QR pass scanning and entry validation.
  - Planned synthetic data scope: 20 sample member profiles, test Razorpay orders, and mock webhook events.
  - `docs/PLAN 2.pdf`: Developed the sample user-testing feedback matrix (recorded as illustrative sample data).
- **Core Technology Selection:**
  - Frontend: React (Vite) for rapid SPA rendering.
  - Backend: Node.js with Express.js REST API.
  - Database: MongoDB with Mongoose object modeling.

---

## 💳 Milestone 2 (M2) – Core Membership, QR Verification & Payments

- **Authentication System:**
  - Dual-mode `AuthModal` supporting login and registration.
  - Role-based authorization (`member`, `staff`, `admin`) secured with JWT.
- **Membership Tiers Implemented:**
  - **Basic Plan:** ₹1,500 / 30 Days (8 studio yoga classes).
  - **Standard Plan:** ₹3,000 / 30 Days (25 studio yoga classes).
  - **Premium Plan:** ₹7,500 / 90 Days (Unlimited studio yoga classes).
- **Payment Processing (Test Mode):**
  - Integrated Razorpay order generation (`/api/payments/create-order`).
  - Client-side checkout modal with HMAC-SHA256 signature verification (`/api/payments/verify`).
- **Digital Pass & QR Terminal:**
  - Unique cryptographic pass code generation per member profile.
  - Real-time QR code rendering using `qrcode` library.
  - Full-screen scanner modal (`QRPassModal`) and pass PNG download utility.
- **Staff Check-In Console:**
  - Integrated `html5-qrcode` camera barcode/QR scanner.
  - Alternative manual pass code entry form.
  - Instant validation logic distinguishing allowed vs. denied entry.
  - Attendance database logging with atomic increment of classes used.

---

## 🛡️ Milestone 3 (M3) – Hardening, Automation & AI Assistant

- **Webhook Security Hardening:**
  - Configured raw Buffer body capture on `/api/payments/webhook` via `express.raw({ type: '*/*' })` prior to JSON body-parser middleware.
  - Verified HMAC-SHA256 signature against `RAZORPAY_WEBHOOK_SECRET`.
  - Added idempotency guard preventing duplicate fulfillment on retried `payment.captured` events.
- **Self-Service Membership Pause (Task 9):**
  - Member can select 1 to 15 days of pause duration directly in the Member Dashboard.
  - Strict business policy enforced: maximum **once per calendar year** per member.
  - Automatic validity extension: `endDate` extended by the paused duration upon submission.
- **Automated Background Jobs:**
  - `jobs/membershipPauseJob.js`: Scans daily at midnight to automatically resume memberships whose `pauseEndDate` has passed.
  - `jobs/membershipExpiryJob.js`: Evaluates expiring memberships, marks expired passes as `ended`, and triggers email notification hooks for memberships expiring within 3 days.
- **AI Absentee Follow-Up Drafts (Task 11):**
  - Administrative tool in Staff Dashboard filtering members inactive for 14, 30, 60, or 90 days.
  - Generates personalized re-engagement draft messages for staff review with quick copy-to-clipboard functionality.
- **Dedicated AI Assistant Page:**
  - Standalone full-width route (`/ai-assistant`) and component (`AIAssistantPage.jsx`) styled with Mediterranean Burgundy tokens (`AIAssistantPage.css`).
  - Implemented 9 deterministic intent handlers in `backend/routes/aiRoutes.js` for instant live telemetry queries (status, remaining classes, expiry dates, pause policy).
- **Design System Polish:**
  - Elevated UI/UX across Member Dashboard, Staff Console, Landing Page, and Modals to a clean SaaS dashboard aesthetic.

---

## 📝 Milestone 4 (M4) – Documentation, Final Audit & Verification

- **URL Audit & Correction:**
  - Corrected live deployment URL across all documentation to: `https://member-pass-psi.vercel.app/`
  - Verified and retained GitHub repository URL: `https://github.com/sweetha1416/MemberPass`
- **Documentation Suite Created (`docs/`):**
  - `docs/AI_NOTES.md`: Source-verified documentation of the PyTorch GRU architecture, FastAPI microservice, tokenization loop, and Node.js fallback logic.
  - `docs/TEST_REPORT.md`: Comprehensive audit report categorizing previously reported automated regression results (76/76 passed) and identifying unverified/pending tasks.
  - `docs/PROGRESS.md`: This comprehensive milestone tracker.
  - `docs/DEMO_SCRIPT.md`: Step-by-step evaluator testing guide.
- **Limitations & Transparency:**
  - Documented honestly that the Python AI environment and runtime execution have not been successfully verified.
  - Confirmed synthetic/test data boundaries per `docs/PLAN.pdf`.
  - Confirmed that `test-live-api.js` had a code fix but was not executed against a live production database during this audit.
- **Build & Integrity Checks:**
  - Verified clean production Vite frontend build (0 errors).
  - Confirmed zero modifications to application logic, database schemas, payment configurations, or live code.
