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

  static async getUsers(req, res, next) {
    new SuccessResponse({
      message: "Get users successfully",
      data: await UserService.getUsers(req),
    }).send(res);
  }

  static async getUser(req, res, next) {
    new SuccessResponse({
      message: "Get user successfully",
      data: await UserService.getUser(req),
    }).send(res);
  }
}

module.exports = UserController;
