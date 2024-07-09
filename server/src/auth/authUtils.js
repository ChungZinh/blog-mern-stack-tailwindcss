const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { UnauthorizedResponse } = require("../core/error.response");
const KeyService = require("../services/key.service");

const HEADER = {
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
};

const generateTokens = (payload, privateKey) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers[HEADER.AUTHORIZATION]?.toString();
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  const key = await KeyService.findByUserId(userId);
  if (!token) throw new UnauthorizedResponse("Token is required");
  try {
    const decodeUser = jwt.verify(token, key.privateKey);
    if (userId !== decodeUser._id)
      throw new UnauthorizedResponse("Invalid user id");

    req.user = decodeUser;
    return next();
  } catch (error) {
    throw new UnauthorizedResponse("Invalid token1");
  }
});

module.exports = {
  generateTokens,
  verifyToken,
};
