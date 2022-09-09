import { format as _format, createLogger, transports as _transports } from "winston";
import { join } from "path";

const LOGS_DIR = "./logs";

const myFormat = _format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

let errorLogFileNameDate = `${new Date().getUTCFullYear()}/${new Date().getUTCMonth()}/${new Date().getUTCDate()}/`;

const logger = createLogger({
  level: "debug",
  format: _format.combine(_format.colorize(), _format.timestamp(), myFormat),
  defaultMeta: { service: "user-service" },
  transports: [
    new _transports.File({ filename: join(LOGS_DIR, errorLogFileNameDate + "error.log"), level: "error" }),
    new _transports.File({ filename: join(LOGS_DIR, errorLogFileNameDate + "combined.log") }),
  ],
});

export { logger };
