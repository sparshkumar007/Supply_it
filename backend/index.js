const express = require("express");
const cors = require('cors');
const { logger, requestsLogger } = require("./utils/logger");
const errorHandler = require("./middleware/errorHandlingMiddleware");
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Connect to database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware for error handling
app.use(errorHandler);

// Middleware for Setup for Requests logging
app.use(requestsLogger);

// Middleware for Routing
app.use("/", require("./routes"));

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
