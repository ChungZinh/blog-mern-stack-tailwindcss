const {
  SuccessResponse,
  CreatedResponse,
} = require("../core/success.response");
const AuthService = require("../services/auth.service");
class AuthController {
  static async signUp(req, res, next) {
    new SuccessResponse({
      message: "Sign up successfully",
      data: await AuthService.signUp(req.body),
    }).send(res);
  }
  static async signIn(req, res, next) {
    new SuccessResponse({
      message: "Sign in successfully",
      data: await AuthService.signIn(req.body),
    }).send(res);
  }
  static async googleAuth(req, res, next) {
    new SuccessResponse({
      message: "Google Auth successfully",
      data: await AuthService.googleAuth(req.body),
    }).send(res);
  }
  static async logout(req, res, next) {
    new SuccessResponse({
      message: "Logout successfully",
      data: await AuthService.logout(req),
    }).send(res);
  }
}

module.exports = AuthController;
