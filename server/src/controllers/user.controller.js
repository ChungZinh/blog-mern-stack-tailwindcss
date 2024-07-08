const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  static async updateUser(req, res, next) {
    new SuccessResponse({
      message: "User updated successfully",
      data: await UserService.updateUser(req),
    }).send(res);
  }
}

module.exports = UserController;
