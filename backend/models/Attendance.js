const mongoose = require("mongoose");

const getIndiaDateKey = (date = new Date()) => {
  const IST_OFFSET = 330 * 60 * 1000;
  const istDate = new Date(date.getTime() + IST_OFFSET);
  return istDate.toISOString().split("T")[0];
};

const attendanceSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    checkInId: {
      type: String,
      required: true,
      unique: true
    },
    dateKey: {
      type: String,
      default: () => getIndiaDateKey(),
      index: true
    },
    checkedInAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  { timestamps: true }
);

attendanceSchema.index({ membership: 1, checkedInAt: -1 });
attendanceSchema.index({ membership: 1, dateKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
module.exports.getIndiaDateKey = getIndiaDateKey;
