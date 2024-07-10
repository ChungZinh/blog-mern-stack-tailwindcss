const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const CommentController = require("../controllers/comment.controller");

router.use(require("../auth/authUtils").verifyToken);
router.post("/create", asyncHandler(CommentController.createComment));
module.exports = router;
