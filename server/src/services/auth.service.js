const { BadRequestResponse } = require("../core/error.response");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

class AuthService {
  static async signUp({ username, email, password, confirmPassword }) {
    //check username, email, password are not empty
    if (!username || !email || !password || !confirmPassword)
      throw new BadRequestResponse("Username, email, password are required");

    //check password and confirm password are same
    if (password !== confirmPassword)
      throw new BadRequestResponse(
        "Password and confirm password are not same"
      );

    //check already exist user
    const user = await User.findOne({ email }).lean();

    if (user) throw new BadRequestResponse("User already exist");

    //create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return newUser;
  }
}

module.exports = AuthService;
