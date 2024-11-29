const express = require("express");
const { logger } = require("./utils/logger");
const router = express.Router();

router.get("/", (req, res) => {
  logger.info("Hello World this is good!");
  res.send("Hello World this is good!");
});

router.use("/auth", require("./routes/authRoutes"));
router.use("/product", require("./routes/productRoutes"));
router.use("/order", require("./routes/orderRoutes"));
router.use("/web3", require("./routes/web3Routes"));

module.exports = router;
