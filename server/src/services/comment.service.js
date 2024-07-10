const { NotFoundResponse } = require("../core/error.response");
const Comment = require("../models/comment.model");
class CommentService {
  static async createComment({ content, postId, userId }) {
    if (!content || !postId || !userId) {
      throw new NotFoundResponse("Content, postId and userId are required");
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    return newComment;
  }

  static async getCommentsByPostId(postId) {
    console.log("post: ", postId)
    const comments = await Comment.find({ postId: postId })
      .populate("userId")
      .sort({ createdAt: -1 });
    return comments;
  }
}

module.exports = CommentService;
