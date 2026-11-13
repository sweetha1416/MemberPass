
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });
if (!process.env.MONGO_URI) {
  dotenv.config();
}

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/plans", require("./routes/planRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/member", require("./routes/memberRoutes"));
app.use("/api/qr", require("./routes/qrRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to MemberPass API"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MemberPass server is running"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

startServer();



