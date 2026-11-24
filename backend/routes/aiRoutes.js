const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Plan = require("../models/Plan");
const Membership = require("../models/Membership");
const Attendance = require("../models/Attendance");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

// Optional authentication middleware: attaches req.user if valid token provided
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token && process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Continue without req.user if token is invalid/expired
  }
  next();
};

// POST /api/ai/chat
router.post("/chat", optionalAuth, async (req, res) => {
  try {
    const { question } = req.body || {};

    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.trim().length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid question (maximum 500 characters)"
      });
    }

    const cleanQuestion = question.trim();
    const qLower = cleanQuestion.toLowerCase();

    // 1. Check if user is asking for their membership status
    if (
      qLower.includes("membership status") ||
      qLower.includes("my status") ||
      qLower.includes("check my status") ||
      (qLower.includes("status") && qLower.includes("membership"))
    ) {
      if (!req.user) {
        return res.json({
          success: true,
          question: cleanQuestion,
          answer:
            "To check your live membership status and remaining classes, please sign in to your MemberPass account.",
          requiresAuth: true
        });
      }

      const membership = await Membership.findOne({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("plan");

      if (!membership) {
        return res.json({
          success: true,
          question: cleanQuestion,
          answer: `Hello **${req.user.name}**! You do not currently have an active membership pass. You can browse our Basic (₹1,500), Standard (₹3,000), or Premium (₹7,500) yoga tiers under the Membership Plans section to claim your pass.`
        });
      }

      const planName = membership.plan?.name || "MemberPass Tier";
      const limit = membership.plan?.classLimit ?? "Unlimited";
      const endDateStr = new Date(membership.endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      const statusUpper = (membership.status || "ACTIVE").toUpperCase();

      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `Hello **${req.user.name}**! Here is your current membership overview:

• **Plan:** ${planName}
• **Status:** ${statusUpper}
• **Classes Attended:** ${membership.classesUsed || 0} of ${limit}
• **Valid Until:** ${endDateStr}
• **Digital QR Pass:** ${statusUpper === "ACTIVE" ? "Ready for check-in" : statusUpper}

${membership.status === "paused"
            ? `Your pass is currently paused until ${new Date(membership.pauseEndDate).toLocaleDateString("en-IN")}. Your membership expiry has been extended accordingly.`
            : membership.status === "ended"
              ? "Your previous membership has ended. You can renew your pass from the Membership Plans section."
              : "Your pass is active and in good standing. Present your digital QR pass at the studio front desk for instant entry."
          }`
      });
    }

    // 2. Check how many classes attended / attendance count
    if (
      (qLower.includes("classes") &&
        (qLower.includes("attended") ||
          qLower.includes("many") ||
          qLower.includes("used") ||
          qLower.includes("count") ||
          qLower.includes("remain") ||
          qLower.includes("left"))) ||
      qLower.includes("attendance history") ||
      qLower.includes("how many classes")
    ) {
      if (!req.user) {
        return res.json({
          success: true,
          question: cleanQuestion,
          answer:
            "Please log in to your MemberPass account to view your verified class attendance records.",
          requiresAuth: true
        });
      }

      const membership = await Membership.findOne({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("plan");
      const totalCheckins = await Attendance.countDocuments({
        member: req.user._id
      });

      if (!membership) {
        return res.json({
          success: true,
          question: cleanQuestion,
          answer: `Hello **${req.user.name}**! You do not have an active membership. Lifetime studio check-ins on record: **${totalCheckins}**.`
        });
      }

      const planName = membership.plan?.name || "Membership";
      const used = membership.classesUsed || 0;
      const limit = membership.plan?.classLimit;
      const remaining =
        limit !== null && limit !== undefined && Number(limit) > 0
          ? Math.max(0, limit - used)
          : "Unlimited";

      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `Hello **${req.user.name}**! Here is your class attendance breakdown:

• **Current Plan:** ${planName}
• **Classes Attended:** ${used} session${used === 1 ? "" : "s"}
• **Classes Remaining:** ${remaining}
• **Lifetime Studio Check-ins:** ${totalCheckins}

Your attendance is securely logged whenever authorized staff scans your encrypted QR pass at the studio.`
      });
    }

    // 3. Check when membership expires
    if (
      qLower.includes("expire") ||
      qLower.includes("expiry") ||
      qLower.includes("end date") ||
      qLower.includes("valid until") ||
      qLower.includes("when does my membership")
    ) {
      if (!req.user) {
        return res.json({
          success: true,
          question: cleanQuestion,
          answer:
            "Please log in to your MemberPass account to check your exact membership expiration date.",
          requiresAuth: true
        });
      }

      const membership = await Membership.findOne({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("plan");

      if (!membership) {
        return res.json({
          success: true,
          question: cleanQuestion,
          answer: `Hello **${req.user.name}**! You do not currently have an active membership with an expiration date. You can select a plan anytime to begin your practice.`
        });
      }

      const endDateStr = new Date(membership.endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      const diffMs = new Date(membership.endDate) - new Date();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `Hello **${req.user.name}**! Your **${membership.plan?.name || "MemberPass"
          }** membership expiration details:

• **Expiry Date:** ${endDateStr}
• **Days Remaining:** ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}
• **Status:** ${(membership.status || "active").toUpperCase()}

We will send renewal notifications to your registered email before expiry so your studio access remains uninterrupted.`
      });
    }

    // 4. Explain membership plans
    if (
      qLower.includes("membership plans") ||
      qLower.includes("explain the plans") ||
      qLower.includes("what plans") ||
      qLower.includes("pricing") ||
      qLower.includes("tiers") ||
      (qLower.includes("plan") && (qLower.includes("cost") || qLower.includes("price") || qLower.includes("available")))
    ) {
      let plans = [];
      try {
        plans = await Plan.find({ isActive: true }).sort({ priceInPaise: 1 });
      } catch (e) {
        // Fallback plans if db query fails
      }

      if (plans.length > 0) {
        const planList = plans
          .map((p, idx) => {
            const priceInRupees = p.priceInPaise
              ? p.priceInPaise / 100
              : p.price || 0;
            const classLimitStr =
              p.classLimit && Number(p.classLimit) > 0
                ? `${p.classLimit} studio classes`
                : "Unlimited sessions";
            return `${idx + 1}. **${p.name} Plan** — ₹${priceInRupees.toLocaleString("en-IN")} for ${p.durationDays} Days\n   • Classes: ${classLimitStr}\n   • ${p.description || "Full studio access with encrypted digital QR pass"}`;
          })
          .join("\n\n");

        return res.json({
          success: true,
          question: cleanQuestion,
          answer: `MemberPass offers tailored membership tiers for yoga & wellness practitioners:

${planList}

All memberships include instant digital QR passes, real-time class tracking, and Razorpay-verified payments.`
        });
      }

      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `MemberPass offers three tailored yoga & wellness membership plans:

1. **Basic Plan (₹1,500 / 30 Days)**: 8 studio yoga classes, encrypted digital QR pass, attendance tracking.
2. **Standard Plan (₹3,000 / 30 Days)**: 25 studio yoga classes, priority booking, flexible scheduling.
3. **Premium Plan (₹7,500 / 90 Days)**: Unlimited studio sessions & masterclasses, VIP wellness consultations, 90-day extended validity.

You can select and activate any plan with secure Razorpay test checkout under the **Membership Plans** section.`
      });
    }

    // 5. How to pause membership
    if (
      qLower.includes("pause") ||
      qLower.includes("freeze") ||
      qLower.includes("hold") ||
      qLower.includes("suspend") ||
      qLower.includes("break")
    ) {
      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `You can pause your active membership anytime directly from the **Member Dashboard**:

1. Log in and navigate to your **Member Dashboard**.
2. Scroll to the **Membership Pause** section.
3. Select your desired pause duration between **1 and 15 days**.
4. Confirm your pause request.

**Important Policy Details:**
• **Frequency:** Members may pause an active pass **once per calendar year**.
• **Duration Limits:** Select any duration from **1 to 15 days**.
• **Automatic Validity Extension:** Your membership expiration date is automatically extended by the exact number of paused days.
• **Access Suspension:** Studio check-in is temporarily suspended while paused and resumes automatically on your scheduled resume date.`
      });
    }

    // 6. Attendance Privacy & Data Protection
    if (
      qLower.includes("privacy") ||
      qLower.includes("confidential") ||
      qLower.includes("who is attending") ||
      qLower.includes("other member") ||
      qLower.includes("member list") ||
      qLower.includes("who attended") ||
      (qLower.includes("attendance") && (qLower.includes("private") || qLower.includes("protect") || qLower.includes("safe") || qLower.includes("policy")))
    ) {
      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `MemberPass protects member privacy through strict access controls and authentication boundaries:

• **Confidential Logs:** Individual class check-in records are strictly confidential and accessible exclusively to the authenticated account holder and authorized studio staff.
• **No Cross-Member Exposure:** Members cannot view, search, or access other practitioners' attendance history, check-in timestamps, or contact details.
• **Pass Key Verification:** Studio check-ins utilize a unique 256-bit cryptographic pass code to authenticate memberships without exposing personal credentials.`
      });
    }

    // 7. Renewals & Membership Extension
    if (
      qLower.includes("renew") ||
      qLower.includes("extend") ||
      qLower.includes("re-activate") ||
      qLower.includes("continue membership")
    ) {
      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `You can renew or upgrade your yoga pass at any time:

1. Navigate to the **Membership Plans** section on the website or click **Upgrade / Renew Plan** on your Member Dashboard.
2. Select your desired plan: Basic (₹1,500 / 8 classes), Standard (₹3,000 / 25 classes), or Premium (₹7,500 / Unlimited).
3. Complete the checkout through Razorpay test mode.
4. Once payment is confirmed and captured via Razorpay, your renewed membership privileges, validity period, and QR pass are activated automatically.`
      });
    }

    // 8. Payment & Invoicing Queries
    if (
      qLower.includes("payment") ||
      qLower.includes("receipt") ||
      qLower.includes("invoice") ||
      qLower.includes("refund") ||
      qLower.includes("razorpay") ||
      qLower.includes("billing")
    ) {
      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `MemberPass manages payments through secure Razorpay integration:

• **Payment Records:** You can review all recent transactions, order IDs, and payment references directly in your **Member Dashboard** under Recent Transactions.
• **Security:** All transactions use encrypted tokens with real-time signature verification.
• **Refund Policy:** If you encounter billing issues or need assistance with a transaction, please speak with the front desk or submit an inquiry via our contact form.`
      });
    }

    // 9. Support & Studio Hours
    if (
      qLower.includes("support") ||
      qLower.includes("contact") ||
      qLower.includes("phone") ||
      qLower.includes("email") ||
      qLower.includes("hours") ||
      qLower.includes("front desk") ||
      qLower.includes("timing") ||
      qLower.includes("helpdesk")
    ) {
      return res.json({
        success: true,
        question: cleanQuestion,
        answer: `Our dedicated wellness concierge and front-desk team are here to assist you:

• **Studio Hours:** Monday – Sunday: 06:00 – 21:00 IST (front-desk studio access)
• **Contact Desk:** Visit the front desk at our yoga sanctuary or submit the Contact form on our home page.
• **Support Inquiries:** Inquiries can be submitted via the contact form on our website or directly with attending studio staff.
• **Immediate Assistance:** Speak directly with attending studio staff during operating hours.`
      });
    }

    // 6. Try external AI microservice (Python / FastAPI) if reachable
    try {
      const response = await fetch(`${AI_SERVICE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: cleanQuestion
        }),
        signal: AbortSignal.timeout(4000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer && data.answer.trim().length > 0) {
          return res.json(data);
        }
      }
    } catch (aiErr) {
      // Python AI service not running on port 8000; fallback to contextual intelligent answer
    }

    // 7. Domain Knowledge Fallback for MemberPass queries
    if (
      qLower.includes("qr") ||
      qLower.includes("check-in") ||
      qLower.includes("check in") ||
      qLower.includes("scanner")
    ) {
      return res.json({
        success: true,
        question: cleanQuestion,
        answer:
          "MemberPass uses cryptographic digital QR passes. When you arrive at the yoga studio, simply present your pass from your phone or mobile browser. Authorized staff scan it with their camera scanner to instantly verify validity and deduct one class credit."
      });
    }

    if (
      qLower.includes("what is memberpass") ||
      qLower.includes("about memberpass") ||
      qLower.includes("who are you") ||
      qLower.includes("help")
    ) {
      return res.json({
        success: true,
        question: cleanQuestion,
        answer:
          "MemberPass is an all-in-one membership management platform engineered for yoga centres and wellness studios. We provide digital QR passes, automated class attendance verification, Razorpay payment processing, and intelligent member assistance."
      });
    }

    // General intelligent assistant response
    return res.json({
      success: true,
      question: cleanQuestion,
      answer: `Thank you for asking about **"${cleanQuestion}"**.

MemberPass is configured to assist with:
• **Membership Status & Renewals** — Check active plans, remaining days, and validity.
• **Attendance Tracking** — View attended classes and remaining sessions.
• **Digital QR Passes** — Access your personal pass for front-desk check-in.
• **Membership Plans** — Compare Basic, Standard, and Premium tiers.
• **Account Management** — Pause membership, view payment history, and update details.

Try asking: *"Check my membership status"*, *"How many classes have I attended?"*, or *"Explain the membership plans"* for instant answers!`
    });
  } catch (error) {
    console.error("AI service error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing your question."
    });
  }
});

module.exports = router;
