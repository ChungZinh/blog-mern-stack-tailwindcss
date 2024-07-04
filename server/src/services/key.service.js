const Key = require("../models/key.model");
const { Types } = require("mongoose");

class KeyService {
  static async createKey({ userId, publicKey, privateKey, refreshToken }) {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshToken,
        refreshTokenUsed: [],
      };
      const options = { new: true, upsert: true };

      const key = await Key.findOneAndUpdate(filter, update, options);

      return key;
    } catch (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
}

module.exports = KeyService;
