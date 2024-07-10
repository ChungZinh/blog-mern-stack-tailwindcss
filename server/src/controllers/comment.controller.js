const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");
class CommentController{
    static async createComment(req, res, next){
        new SuccessResponse({
            message: "Comment created successfully",
            data: await CommentService.createComment(req.body)
        }).send(res);
    }
}

module.exports = CommentController;