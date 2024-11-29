const createResponse = (res, statusCode, message, data = [], success = true) => {
  return res.status(statusCode).json({
    success: success,
    message: message,
    data: data
  });
};

module.exports = { createResponse };
