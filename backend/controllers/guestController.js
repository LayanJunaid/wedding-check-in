const Guest = require("../models/Guest");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const { JWT_SECRET } = require("../config/jwt");

// إضافة ضيف
exports.addGuest = async (req, res) => {
  try {
    const { name, weddingId } = req.body;
    const guest = await Guest.create({ name, wedding: weddingId });
    const token = generateToken({ id: guest._id });
    guest.token = token;
    await guest.save();
    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// جلب ضيوف حفلة
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ wedding: req.params.weddingId });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// تسجيل دخول ضيف
exports.checkin = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const guest = await Guest.findById(decoded.id);

    if (!guest) return res.json({ status: "invalid" });
    if (guest.used)
      return res.json({ status: "already_used", name: guest.name });

    guest.used = true;
    guest.checkinTime = new Date();
    await guest.save();

    const io = req.app.get("io");
    io.emit("guest_checked_in", { name: guest.name });

    res.json({ status: "success", name: guest.name });
  } catch (err) {
    res.json({ status: "invalid_token" });
  }
};

// حذف ضيف
exports.deleteGuest = async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
