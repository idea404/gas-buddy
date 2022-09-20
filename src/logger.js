import { createLogger, format as _format, transports } from "winston";

const myFormat = _format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: _format.combine(_format.colorize(), _format.timestamp(), myFormat),
  transports: [new transports.Console()],
});

export { logger };
