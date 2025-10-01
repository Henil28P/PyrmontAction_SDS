const express = require("express");
const router = express.Router();

// DEMO join: always succeed and send the frontend redirect URL
router.post("/start", (req, res) => {
  const base = process.env.JOIN_URL || "http://localhost:5178/joinus";
  const url = `${base}?status=success&intentId=demo`;
  return res.json({ url });
});

module.exports = router;
