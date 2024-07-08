const { UnauthorizedResponse } = require("../core/error.response");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
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
}

module.exports = UserService;
