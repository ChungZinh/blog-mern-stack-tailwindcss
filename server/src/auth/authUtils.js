const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");

const generateTokens = (payload, privateKey) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "15m",
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

module.exports = {
  generateTokens,
};
