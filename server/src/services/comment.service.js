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
    console.log("post: ", postId);
    const comments = await Comment.find({ postId: postId })
      .populate("userId")
      .sort({ createdAt: -1 });
    return comments;
  }

  static async like(req) {
    console.log("req: ", req.params.id);
    const comment = await Comment.findById(req.params.id);
    if (!comment) throw new NotFoundResponse("Comment not found");

    const userIndex = comment.likes.indexOf(req.user._id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user._id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    return comment;
  }

  static async edit(req) {
    const comment = await Comment.findById(req.params.id);
    if (!comment) throw new NotFoundResponse("Comment not found");

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      throw new NotFoundResponse("You are not allowed to edit this comment");
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        content: req.body.content,
      },
      { new: true }
    );

    return editedComment;
  }

  static async delete(req) {
    const comment = await Comment.findById(req.params.id);
    if (!comment) throw new NotFoundResponse("Comment not found");

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      throw new NotFoundResponse("You are not allowed to edit this comment");
    }

    await Comment.findByIdAndDelete(req.params.id);
  }

  static async getAllComments(req) {
    if (!req.user.isAdmin) {
      throw new NotFoundResponse("You are not allowed to edit this comment");
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sortDirection || "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const commentsLastMonth = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return {
      comments,
      totalComments,
      commentsLastMonth,
    };
  }
}

module.exports = CommentService;
