// utils for database functions

const asyncHandler = require("./AsyncHandling");
const User = require("../models/User");
const { logger } = require("./logger");

const findByEmail = asyncHandler(async (email) => {
  logger.info("Request to db.findByEmail has entered");
  const user = await User.findOne({ email });
  logger.info("Request to db.findByEmail has exited");
  if (user) {
    return true;
  }
  return false;
});

module.exports = { findByEmail };
