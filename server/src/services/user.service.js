const { UnauthorizedResponse } = require("../core/error.response");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Key = require("../models/key.model");
class UserService {
  static async updateUser(req) {
    if (req.user._id !== req.params.userId)
      throw new UnauthorizedResponse("Invalid user id");

    if (req.body.password) {
      if (req.body.password.length < 6) {
        throw new UnauthorizedResponse(
          "Password must be at least 6 characters"
        );
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.body.username < 7 || req.body.username > 20) {
      throw new UnauthorizedResponse(
        "Username must be at least 7 characters and at most 20 characters"
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      }
    );

    return updatedUser;
  }

  static async deleteUser(req) {
    await User.findByIdAndDelete(req.params.userId);
    await Key.findOneAndDelete({ user: req.params.userId });
  }

  static async getUsers(req) {
    if (!req.user.isAdmin)
      throw new UnauthorizedResponse(
        "You are not authorized to perform this action"
      );

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const user = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const userWithoutPassword = user.map((u) => {
      const { password, ...rest } = u._doc;
      return rest;
    });

    const total = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return {
      total,
      users: userWithoutPassword,
      lastMonthUsers,
    };
  }

  static async getUser(req) {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new UnauthorizedResponse("User not found");
    }
    const { password, ...rest } = user._doc;
    return rest;
  }
}

module.exports = UserService;
