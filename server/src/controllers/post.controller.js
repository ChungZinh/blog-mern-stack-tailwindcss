const { SuccessResponse } = require("../core/success.response");
const PostService = require("../services/post.service");
class PostController {
  static async create(req, res, next) {
    new SuccessResponse({
      message: "Post created successfully",
      data: await PostService.create(req),
    }).send(res);
  }
}

module.exports = PostController;
