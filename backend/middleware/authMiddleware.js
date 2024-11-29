const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/AsyncHandling");
const { logger } = require("../utils/logger");
const { createResponse } = require("../utils/ResponseHandling");
const User = require("../models/User");

const authorize = asyncHandler(async (req, res, next) => {
  logger.info("Request to authMiddleware.authorize has entered");
  logger.info("cookies: " + JSON.stringify(req.cookies));
  const token = req.cookies?.token;

  if (!token) {
    createResponse(res, 401, "Not authorized, no token");
    throw new Error("Not authorized, no token");
  }

  logger.info("Token is present: " + token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  logger.info("Token is verified");
  logger.info("decoded: " + JSON.stringify(decoded));
  const user_id = decoded.id;
  const user = await User.findById(user_id);
  req.user = user;

  logger.info("Request to authMiddleware.authorize has exited");
  next();
});

const protect = (req, res, next) => {
  // ... middleware code ...
};

module.exports = { authorize, protect };
