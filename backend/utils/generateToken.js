const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" });
};

module.exports = generateToken;
