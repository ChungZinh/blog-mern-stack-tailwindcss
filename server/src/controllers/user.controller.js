const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  static async updateUser(req, res, next) {
    new SuccessResponse({
      message: "User updated successfully",
      data: await UserService.updateUser(req),
    }).send(res);
  }

  static async deleteUser(req, res, next) {
    new SuccessResponse({
      message: "Delete user successfully",
      data: await UserService.deleteUser(req),
    }).send(res);
  }
}

module.exports = UserController;
