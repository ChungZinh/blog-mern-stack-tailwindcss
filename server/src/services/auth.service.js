const { generateTokens } = require("../auth/authUtils");
const { BadRequestResponse } = require("../core/error.response");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyService = require("./key.service");
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

  static async signIn({ username, password }) {
    // check if user exist
    const user = await User.findOne({ username }).lean();
    if (!user) throw new BadRequestResponse("Invalid email or password");

    // check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new BadRequestResponse("Invalid email or password");

    // create token
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const token = await generateTokens(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      privateKey
    );

    const key = await KeyService.createKey({
      userId: user._id,
      publicKey,
      privateKey,
      refreshToken: token.refreshToken,
    });

    return {
      user,
      token: token.accessToken,
    };
  }
}

module.exports = AuthService;
