const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ sub: user._id, email: user.email, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { email: user.email, role: user.role_id, membershipStatus: user.membershipStatus } });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

exports.requireAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.sub).select("-passwordHash");
  res.json({ user });
};
