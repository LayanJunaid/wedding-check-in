const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  token: String,
  used: { type: Boolean, default: false },
  checkinTime: Date,
});

module.exports = mongoose.model("Guest", guestSchema);
