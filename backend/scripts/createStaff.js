require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

async function createStaff() {
  try {
    await connectDB();

    const staffEmail = process.env.STAFF_EMAIL || process.argv[2] || "m2.staff@example.com";
    let staffPassword = process.env.STAFF_PASSWORD || process.argv[3];

    if (!staffPassword) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("STAFF_PASSWORD environment variable is required in production");
      }
      staffPassword = "MemberPass@123";
    }

    let staff = await User.findOne({
      email: staffEmail
    });

    if (!staff) {
      staff = new User({
        name: "MemberPass Staff",
        email: staffEmail,
        password: staffPassword,
        phone: "9876500099",
        role: "staff",
        isActive: true
      });
    } else {
      staff.name = "MemberPass Staff";
      staff.password = staffPassword;
      staff.role = "staff";
      staff.isActive = true;
    }

    await staff.save();

    console.log("Staff account created/updated successfully!");
    console.log("Email:", staff.email);
    console.log("Role:", staff.role);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Staff creation failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createStaff();
