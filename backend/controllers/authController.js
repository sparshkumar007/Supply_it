const asyncHandler = require("../utils/AsyncHandling");
const { logger } = require("../utils/logger");
const { createResponse } = require("../utils/ResponseHandling");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = asyncHandler(async (req, res) => {
  logger.info("Request to authController.signup has entered");
  const { name, username, email, password, city, category } = req.body;

  if (await User.findOne({ email })) {
    logger.error("Email already exists");
    logger.info("Request to authController.signup has exited");
    return createResponse(res, 400, "Email already exists");
  }
  if (await User.findOne({ username })) {
    logger.error("Username already exists");
    logger.info("Request to authController.signup has exited");
    return createResponse(res, 400, "Username already exists");
  }
  logger.info(
    "Username and email does not exist...Continuing in signup process"
  );

  // encrypt the pasword using salt and hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // adding users information in database with unverified tag
  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    city,
    category,
    status: false,
  });
  logger.info("User Registered successfully");
  return createResponse(res, 201, "User Registered successfully", user);
});

const login = asyncHandler(async (req, res) => {
  logger.info("Request to authController.login has entered");
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    logger.error("User not found");
    logger.info("Request to authController.login has exited");
    return createResponse(res, 404, "User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    logger.error("Password is incorrect");
    logger.info("Request to authController.login has exited");
    return createResponse(res, 400, "Password is incorrect");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  // Remove password from user object
  const userWithoutPassword = {
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    city: user.city,
    category: user.category
  };

  logger.info("User logged in");
  return createResponse(res, 200, "User logged in", { user: userWithoutPassword });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  logger.info("User logged out");
  return createResponse(res, 200, "User logged out");
});

const getProfile = asyncHandler(async (req, res) => {
  logger.info("Request to get user profile");
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    logger.error("User not found");
    return createResponse(res, 404, "User not found");
  }
  return createResponse(res, 200, "Profile fetched successfully", { user });
});

module.exports = {
  signup,
  login,
  logout,
  getProfile
};
