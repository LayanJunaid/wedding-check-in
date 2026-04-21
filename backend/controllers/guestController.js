const Guest = require("../models/Guest");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const { JWT_SECRET } = require("../config/jwt");

// ➕ Add Guest
exports.addGuest = async (req, res) => {
  try {
    const guest = await Guest.create({
      name: req.body.name,
    });

    const token = generateToken({ id: guest._id });

    guest.token = token;
    await guest.save();

    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Check-in Guest
exports.checkin = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);

    const guest = await Guest.findById(decoded.id);

    if (!guest) return res.json({ status: "invalid" });

    if (guest.used) return res.json({ status: "already_used" });

    guest.used = true;
    guest.checkinTime = new Date();
    await guest.save();

    // 🔥 Socket event
    const io = req.app.get("io");
    io.emit("guest_checked_in", {
      name: guest.name,
    });

    res.json({ status: "success", name: guest.name });
  } catch (err) {
    res.json({ status: "invalid_token" });
  }
};
