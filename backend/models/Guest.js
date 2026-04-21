const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    token: String,
    used: { type: Boolean, default: false },
    checkinTime: Date,
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Guest", guestSchema);
