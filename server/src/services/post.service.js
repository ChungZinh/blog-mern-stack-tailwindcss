const { UnauthorizedResponse } = require("../core/error.response");
const Post = require("../models/post.model");
class PostService {
  static async create(req) {
    if (!req.user.isAdmin)
      throw new UnauthorizedResponse("You are not authorized to create a post");

    const slug = req.body.title.toLowerCase().split(" ").join("-");
    const newPost = Post.create({
      ...req.body,
      slug,
      user: req.user._id,
    });

    return newPost;
  }
}

module.exports = PostService;
