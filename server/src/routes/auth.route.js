const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.get("/", (req, res) => {
  res.send("ROUTE AUTH");
});
router.post("/signup", asyncHandler(authController.signUp));
router.post("/signin", asyncHandler(authController.signIn));
router.post("/google", asyncHandler(authController.googleAuth));
router.use(require("../auth/authUtils").verifyToken);
router.post("/logout", asyncHandler(authController.logout));
module.exports = router;
