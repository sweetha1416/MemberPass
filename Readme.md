# MemberPass – Premium Membership Management

MemberPass is a membership management platform designed to simplify membership tracking, attendance, membership plans and member support for yoga studios.

**Live link:** https://member-pass.vercel.app/

## Recordings

- Demo video: Pending – recording will be added later.
- AI assistant demonstration: https://drive.google.com/

## Test logins

Demo accounts are available through the application's demo login interface.

- **Member:** Active Member demo account
- **Staff:** Staff demo account
- **Admin:** Admin demo account (if available in the application)

Demo accounts use sample data only. Do not use real passwords or personal account credentials.

## What it does

1. Allows members to log in and view their membership details, membership status and class usage.
2. Provides membership plans and tracks membership information, expiry and pause status.
3. Supports QR-based membership pass interfaces and staff attendance verification workflows.
4. Provides staff dashboards for attendance history, member management, expiry reminders and absentee-related workflows.
5. Includes an AI assistant to answer membership-related queries and help users understand their membership information.

## The AI feature

- **What it does:** MemberPass includes an AI assistant that helps answer membership-related questions and provides membership information. The AI service uses a GRU-based model through a Python FastAPI service.
- **Which free model it uses:** A custom GRU-based model implemented using PyTorch.
- **What happens if the AI service is not available:** The backend includes a fallback response mechanism so that the AI assistant can still provide basic responses when the AI service is unavailable.

## My stack

- **Frontend:** React and Vite – used to build the interactive user interface and dashboards.
- **Backend:** Node.js and Express.js – used to manage API requests, membership operations and backend logic.
- **Database:** MongoDB and Mongoose – used to store and manage membership and application data.
- **AI service:** Python, FastAPI and PyTorch – used to implement and serve the GRU-based AI functionality.
- **Payment integration:** Razorpay test mode – used for payment integration development and testing.
- **Authentication:** Application authentication and role-based interfaces for member and staff workflows.
- **Development tools:** Visual Studio Code, Git and GitHub.
- **AI tools:** ChatGPT and Google Antigravity – used for development assistance, debugging, code exploration and UI/UX improvements.

## Main design choices

- React was chosen to create a component-based and responsive frontend.
- Node.js and Express.js were used to create backend APIs and application logic.
- MongoDB was selected to store flexible membership-related data.
- FastAPI was used to serve the Python AI component separately from the main backend.
- PyTorch was used to implement the GRU-based AI model.
- The application separates member and staff experiences through role-oriented interfaces.
- The project includes membership status handling, including active and paused membership states.
- AI service fallback handling was implemented to improve availability when the separate AI service is unavailable.
- Razorpay test mode was used during payment integration development.

## How to run it on your computer

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

### AI service

```bash
cd memberpass-ai
python -m venv .venvenv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn server:app --host 127.0.0.1 --port 8000
```

### Settings

Configure the required environment variables in the respective `.env` files.

- `VITE_API_URL`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `AI_SERVICE_URL`

Never commit real secrets, API keys or passwords.

## How to run the tests

```bash
node backend/scripts/testSMTP.js
```

Additional manual testing was performed on the deployed application. Testing includes member and staff interfaces, membership information, membership pause status, AI responses and QR-related UI workflows.

## Made-up data

The application uses sample and demonstration data created for development and testing purposes. The demonstration data is intended to be fictional and does not represent real customers or members.

## What works

- **Fully working:** Application frontend, member dashboard interfaces, staff dashboard interfaces, membership information display, membership pause-status display, AI service runtime, AI service fallback, SMTP connection testing and deployed application navigation.
- **Partly done:** AI contextual responses for certain follow-up questions, live QR verification and some staff workflows that require additional backend or real-world verification.
- **Skipped:** Full live production payment validation, real-world QR scanner hardware validation and destructive live database testing during the current verification process.

## What I would do differently with more time

- Improve AI response accuracy and contextual understanding.
- Perform more comprehensive automated backend and frontend testing.
- Improve accessibility and browser autofill support.
- Complete end-to-end testing for QR verification and attendance workflows.
- Improve the application's performance and optimize frontend assets.
- Add more comprehensive monitoring and error handling for production services.