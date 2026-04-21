const Wedding = require("../models/Wedding");
const User = require("../models/User");

// إنشاء حفلة جديدة
exports.createWedding = async (req, res) => {
  try {
    const { name, date } = req.body;
    const wedding = await Wedding.create({
      name,
      date,
      admin: req.user.id,
    });
    res.json(wedding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// جلب كل حفلات الأدمن
exports.getMyWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find({ admin: req.user.id });
    res.json(weddings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// جلب حفلة واحدة
exports.getWedding = async (req, res) => {
  try {
    const wedding = await Wedding.findById(req.params.id)
      .populate("admin", "name email")
      .populate("securityUsers", "name email");

    if (!wedding) return res.status(404).json({ message: "Not found" });

    res.json(wedding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// حذف حفلة
exports.deleteWedding = async (req, res) => {
  try {
    await Wedding.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// إضافة سكيورتي للحفلة
exports.addSecurity = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const wedding = await Wedding.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { securityUsers: user._id } },
      { new: true },
    );
    res.json(wedding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
