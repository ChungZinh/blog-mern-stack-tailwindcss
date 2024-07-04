const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.post("/signup", asyncHandler(authController.signUp));
router.post("/signin", asyncHandler(authController.signIn));

module.exports = router;
