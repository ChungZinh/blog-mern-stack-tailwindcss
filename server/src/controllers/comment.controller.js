const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");
class CommentController {
  static async createComment(req, res, next) {
    new SuccessResponse({
      message: "Comment created successfully",
      data: await CommentService.createComment(req.body),
    }).send(res);
  }

  static async getCommentsByPostId(req, res, next) {
    new SuccessResponse({
      message: "Comments fetched successfully",
      data: await CommentService.getCommentsByPostId(req.params.postId),
    }).send(res);
  }

  static async like(req, res, next) {
    new SuccessResponse({
      message: "Comment liked successfully",
      data: await CommentService.like(req),
    }).send(res)
  }
}

module.exports = CommentController;
