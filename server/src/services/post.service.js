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

  static async getAll(req) {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { user: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const timeNow = new Date();

    const oneMonthAgo = new Date(
      timeNow.getFullYear(),
      timeNow.getMonth() - 1,
      timeNow.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return { posts, totalPosts, lastMonthPosts };
  }

  static async delete(req) {
    await Post.findByIdAndDelete(req.params.id);
  }

  static async update(req) {
    const updatePost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );

    return updatePost;
  }
}

module.exports = PostService;
