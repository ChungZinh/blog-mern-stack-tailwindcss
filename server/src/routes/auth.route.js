const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { asyncHandler } = require("../helpers/asyncHandler");

router.post("/signup", asyncHandler(authController.signUp));
router.post("/signin", asyncHandler(authController.signIn));
router.post('/google', asyncHandler(authController.googleAuth))
router.post('/logout', asyncHandler(authController.logout))
module.exports = router;
