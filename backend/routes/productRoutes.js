const express = require("express");
const { logger } = require("../utils/logger");
const { authorize } = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

logger.info("Request to productRoutes.js has entered");

router.post(
  "/addProduct",
  authorize,
  upload.single('image'),
  require("../controllers/productController").addProduct
);

router.get(
  "/getProducts",
  authorize,
  require("../controllers/productController").getProducts
);

logger.info("Request to productRoutes.js has exited");

module.exports = router;
