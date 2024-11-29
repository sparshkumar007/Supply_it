const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Something went wrong!');
};

module.exports = errorHandler;