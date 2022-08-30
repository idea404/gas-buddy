const winston = require("winston");
const path = require("path");

const LOGS_DIR = "./logs";

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

let errorLogFileNameDate = new Date().toLocaleDateString();

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), myFormat),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: path.join(LOGS_DIR, errorLogFileNameDate + "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(LOGS_DIR, errorLogFileNameDate + "debug.log"), level: "debug" }),
    new winston.transports.File({ filename: path.join(LOGS_DIR, errorLogFileNameDate + "combined.log") }),
  ],
});
