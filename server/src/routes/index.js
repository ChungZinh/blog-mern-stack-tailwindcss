const express = require("express");
const router = express.Router();

router.use("/api/auth", require("./auth.route"));
router.use("/api/user", require("./user.route"));
router.use("/api/post", require("./post.route"));

module.exports = router;
