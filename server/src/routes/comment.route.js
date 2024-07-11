const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helpers/asyncHandler");
const CommentController = require("../controllers/comment.controller");

router.use(require("../auth/authUtils").verifyToken);
router.post("/create", asyncHandler(CommentController.createComment));
router.get("/get/:postId", asyncHandler(CommentController.getCommentsByPostId));
router.put("/like/:id", asyncHandler(CommentController.like));
router.put("/edit/:id", asyncHandler(CommentController.edit));

module.exports = router;
