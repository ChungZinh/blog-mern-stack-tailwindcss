const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.get("/", authController.signIn);
router.post("/signup", asyncHandler(authController.signUp));

module.exports = router;
