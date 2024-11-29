const express = require("express");
const { logger } = require("../utils/logger");
const { authorize } = require("../middleware/authMiddleware");
const router = express.Router();

logger.info("Request to orderRoutes.js has entered");

router.post(
  "/addOrder",
  authorize,
  require("../controllers/orderController").addOrder
);
router.post(
  "/addTrack",
  authorize,
  require("../controllers/orderController").addTrack
);
router.get(
  "/orders_in_queue",
  authorize,
  require("../controllers/orderController").orders_in_queue
);
router.get(
  "/orders_to_deliver",
  authorize,
  require("../controllers/orderController").orders_to_deliver
);
router.post(
  "/verifyTransaction",
  authorize,
  require("../controllers/orderController").verifyTransaction
);
router.post(
  "/getTrack",
  authorize,
  require("../controllers/orderController").getTrack
);
router.get(
  "/getMiddlemen",
  authorize,
  require("../controllers/orderController").getMiddlemen
);
router.get(
  "/getOrderById",
  authorize,
  require("../controllers/orderController").getOrderById
);
router.post(
  "/generateTransferOtp",
  authorize,
  require("../controllers/orderController").generateTransferOTP
);
router.post(
  "/verifyTransferOtp",
  authorize,
  require("../controllers/orderController").verifyTransferOTP
);
router.get('/transactions/:orderId', authorize, require("../controllers/orderController").getOrderTransactions);

logger.info("Request to orderRoutes.js has exited");

module.exports = router;
