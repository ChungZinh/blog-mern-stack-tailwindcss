const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const UserController = require("../controllers/user.controller");

router.use(require("../auth/authUtils").verifyToken);
router.put("/update/:userId", asyncHandler(UserController.updateUser));
router.delete('/delete/:userId', asyncHandler(UserController.deleteUser))
module.exports = router;
