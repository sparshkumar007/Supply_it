const express = require("express");
const { logger } = require("../utils/logger");
const { authorize } = require("../middleware/authMiddleware");
const router = express.Router();

logger.info("Request to authRoutes has entered");

router.post("/signup", require("../controllers/authController").signup);
router.post("/login", require("../controllers/authController").login);
router.get("/logout", require("../controllers/authController").logout);
router.get("/profile", authorize, require("../controllers/authController").getProfile);

logger.info("Request to authRoutes has exited");

module.exports = router;
