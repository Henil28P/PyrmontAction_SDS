const router = require("express").Router();
const { login, requireAuth, me } = require("./authController");

router.post("/login", login);
router.get("/me", requireAuth, me);

module.exports = router;
