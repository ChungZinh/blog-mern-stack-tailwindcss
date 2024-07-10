const { SuccessResponse } = require("../core/success.response");
const PostService = require("../services/post.service");
class PostController {
  static async create(req, res, next) {
    new SuccessResponse({
      message: "Post created successfully",
      data: await PostService.create(req),
    }).send(res);
  }

  static async getAll(req, res, next) {
    new SuccessResponse({
      message: "Get all posts successfully",
      data: await PostService.getAll(req),
    }).send(res);
  }

  static async delete(req, res, next) {
    new SuccessResponse({
      message: "Post deleted successfully",
      data: await PostService.delete(req),
    }).send(res);
  }

  static async update(req, res, next){
    new SuccessResponse({
      message: "Post updated successfully",
      data: await PostService.update(req),
    }).send(res);
  }
}

module.exports = PostController;
