const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;
const morgan = require('morgan');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info', // Default level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Captures stack trace
    logFormat
  ),
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs errors to file
    new transports.File({ filename: 'logs/combined.log' }) // Logs all levels to file
  ]
});

// setup for request logging
const morganFormat=':method :url :status :response-time ms';
const requestsLogger=morgan(morganFormat,{
  stream:{
      write:(message)=>{
          const logObject={
              method:message.split(' ')[0],
              url:message.split(' ')[1],
              status:message.split(' ')[2],
              responseTime:message.split(' ')[3],
              
          };
          logger.info(JSON.stringify(logObject));
      }
  }
})

module.exports = {
  logger,
  requestsLogger
};