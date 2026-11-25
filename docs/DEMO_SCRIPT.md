# MemberPass – End-to-End Demonstration Script

This document provides evaluators, examiners, and project stakeholders with a step-by-step walkthrough to test and demonstrate all features of the **MemberPass** platform.

---

## 🎯 Evaluation Environments

- **Live Deployed Application:** [https://member-pass-psi.vercel.app/](https://member-pass-psi.vercel.app/)
- **GitHub Repository:** [https://github.com/sweetha1416/MemberPass](https://github.com/sweetha1416/MemberPass)
- **Client & Context:** Thendral Yoga Loft, Coimbatore (Vizdale Full-Stack Developer Internship)
- **Data Boundary Notice:** In accordance with project documentation (`docs/PLAN.pdf`), test accounts and synthetic profiles are used for evaluation. No live financial transactions or production member PII are required.

---

## 💻 Local Setup Reference (If Testing Locally)

If running the application locally rather than via the live Vercel URL:

1. **Start Backend:**
   ```bash
   cd backend
   npm install
   npm run dev  # Runs on http://localhost:5000
   ```
2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev  # Runs on http://localhost:5173
   ```
3. **Verified Backend Environment Variables:**
   `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `AI_SERVICE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `STAFF_EMAIL`, `STAFF_PASSWORD`.

---

## 🎬 Step-by-Step Demonstration Flow

### Act 1: Landing Page & Membership Plans Exploration
1. Open [https://member-pass-psi.vercel.app/](https://member-pass-psi.vercel.app/).
2. **Visual Inspection:**
   - Observe the Mediterranean Burgundy design language, editorial typography, brand crest, and sticky navbar.
   - Review the floating badge trust elements on the hero showcase card.
3. **Explore Membership Plans:**
   - Scroll to the **Membership Plans** section.
   - Verify the three privilege tiers:
     - **Basic Plan:** ₹1,500 / 30 Days — 8 studio classes, digital QR pass.
     - **Standard Plan (Featured):** ₹3,000 / 30 Days — 25 studio classes, priority booking.
     - **Premium Plan:** ₹7,500 / 90 Days — Unlimited studio sessions & masterclasses.
4. **Interactive Console:**
   - Scroll to the interactive studio console and toggle between **Yoga Tiers** and **Studio Telemetry** tabs.

---

### Act 2: Member Authentication & Registration
1. Click **Member Access** (or **Join Sanctuary**) in the navbar.
2. The `AuthModal` appears with backdrop blur.
3. **Toggle Modes:** Click between **Sign In** and **Create Account** to observe instant form field adjustments and state clearing.
4. **Login / Register:**
   - Use one of the instant testing profile pills (`.demo-pill`) at the bottom of the modal, OR
   - Register a new synthetic test member account (Name, Email, Password, Phone).
5. Click **Authenticate Entry** / **Complete Registration**.
6. Observe instant authentication, token storage, and redirection to the **Member Dashboard**.

---

### Act 3: Member Dashboard & Digital QR Pass
1. **Welcome Banner:**
   - Verify personalized header (`Welcome back, [Name]`), authenticated practitioner badge, and action buttons (**AI Assistant**, **Refresh Data**, **Upgrade / Renew Plan**).
2. **Review the 4 Metric Stat Cards:**
   - **Membership Standing:** Displays `ACTIVE`, `PAUSED`, or `ENDED` with a status dot indicator.
   - **Privilege Tier:** Shows the current plan name and validity date.
   - **Class Utilization:** Shows classes attended vs. total allowed (e.g., `0 / 8 Classes` for Basic, `0 / 25 Classes` for Standard, or `Unlimited` for Premium).
   - **Pass Code (Cryptographic):** Shows the member's unique pass key. Click to verify the copy-to-clipboard micro-interaction toast.
3. **Digital Pass Card:**
   - Observe the luxury card aesthetic with watermark, member avatar, and pass status pill.
   - **QR Code Container:** View the centered high-contrast optical QR code.
   - **Split Footer:** Review the visually separated **Expiry Date** and **Classes Used** columns.
4. **Pass Actions:**
   - Click **Full-Screen Scanner View** to test the modal presentation (`QRPassModal`).
   - Click **Download Pass (PNG)** to verify local pass export.

---

### Act 4: Self-Service Membership Pause (Task 9)
1. In the Member Dashboard, scroll down to the **Membership Pause** section.
2. **Review Policy Details:**
   - Notice the business policy: Members may pause an active pass **once per calendar year** for a duration between **1 and 15 days**.
3. **Select Duration:** Select any duration (e.g., 7 days) from the dropdown.
4. Click **Pause Membership** and confirm the dialog.
5. **Verify Immediate Status Update:**
   - The membership standing changes to `PAUSED`.
   - The QR pass displays a paused indicator (`Pass Paused • Studio Check-In Disabled`).
   - The membership expiry date is automatically extended by 7 days.
   - A scheduled resume date is clearly reported.

---

### Act 5: Staff Dashboard & QR Attendance Check-In (Task 7 & 8)
1. Sign out of the member account and sign in as a **Staff** user (or navigate to the staff dashboard).
2. Observe the dedicated **Staff Dashboard** (`/staff`) with admin title bar and action controls.
3. **Scan or Validate Pass:**
   - **Method A (Camera Scanner):** Click **Start QR Scanner** to activate the `html5-qrcode` camera feed and scan a member's QR pass.
   - **Method B (Manual Code):** Paste or type the member's pass code into the manual input field.
4. Click **Verify Pass**:
   - If the pass is active: Status reports `GREEN - Entry Allowed`, displaying the member's name, plan, and updated class usage.
   - If the pass is paused: Status reports `RED - Entry Denied (Plan paused)`.
   - If class limit is reached: Status reports `RED - Entry Denied (Class limit reached)`.
5. **Attendance Audit Feed:**
   - Observe the **Attendance History** table updating in real time with member name, email, plan tag, staff attribution, and formatted timestamp.

---

### Act 6: Staff Automation & AI Absentee Drafts (Task 11)
1. **Manual Expiry Check:**
   - Locate the **Expiry Reminders** card.
   - Click **Run Expiry Check Now** to trigger the background expiry check routine manually.
   - Verify summary feedback (count of memberships evaluated and reminders sent).
2. **AI Absentee Follow-Up Drafts:**
   - Locate the **AI Absentee Drafts** card.
   - Select an inactivity threshold: **14 days**, **30 days**, **60 days**, or **90 days**.
   - Click **Generate Drafts**.
   - Review the generated list of inactive members, last attendance date, and personalized follow-up message draft.
   - Click **Copy Message** to test the clipboard copy workflow for front-desk staff.

---

### Act 7: Dedicated AI Assistant Page
1. Click **AI Assistant** in the top navigation bar or from the dashboard action banner.
2. The browser navigates to the dedicated full-width AI Assistant page (`/ai-assistant`).
3. **Test Interactive Suggestion Cards:**
   - Click *"Check my live membership status"* → The assistant provides real-time, database-verified details of your active plan, standing, attended classes, and expiration date.
   - Click *"How many classes have I attended?"* → The assistant reports verified attendance history and remaining session credits.
   - Click *"When does my membership expire?"* → The assistant calculates exact days remaining and expiry date.
   - Click *"Explain the available membership plans"* → The assistant outlines Basic (₹1,500 / 8 classes), Standard (₹3,000 / 25 classes), and Premium (₹7,500 / Unlimited).
   - Click *"How do I pause my membership?"* → The assistant details the self-service pause rules (1–15 days once per calendar year).
4. **Test Custom Queries:**
   - Type *"What are the studio hours?"* → Returns front-desk hours (Monday–Sunday 06:00–21:00 IST).
   - Type *"How is my attendance privacy protected?"* → Explains zero cross-member exposure and pass key protection.
   - Type an open-ended studio question to observe the contextual intelligent fallback response.

---

## ✅ Evaluator Verification Checklist

- [ ] Live URL loads cleanly with Mediterranean Burgundy styling (`https://member-pass-psi.vercel.app/`).
- [ ] Basic plan correctly displays **8 classes** across all landing page and pricing components.
- [ ] Member registration and login function smoothly with clear validation feedback.
- [ ] Member Dashboard accurately displays active status, class limits, QR pass, and pass key.
- [ ] Self-service membership pause (1–15 days) successfully updates status and extends expiry date.
- [ ] Staff check-in terminal correctly validates passes and prevents double class deduction on the same day.
- [ ] Staff Absentee Drafts generate personalized re-engagement messages for inactive practitioners.
- [ ] Dedicated AI Assistant page answers live telemetry questions accurately without unhandled errors.
- [ ] Mobile responsive layout renders cleanly across tablet and mobile viewports.
