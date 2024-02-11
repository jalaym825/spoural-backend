import winston, { format } from "winston";
const { combine, timestamp, prettyPrint, printf, errors } = format;
import { DateTime } from "luxon";

const timezoned = () => {
   return DateTime.now()
      .setZone("Asia/Kolkata")
      .toFormat("dd-MM-yyyy HH:mm:ss");
};

const myFormat = printf(({ level, message, label, timestamp }) => {
   return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
   level: "debug",
   format: combine(
      errors({ stack: true }),
      timestamp({ format: timezoned }),
      prettyPrint(),
      myFormat
   ),
   defaultMeta: { service: "user-service" },
   transports: [
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "server.log" }),
   ],
});

export default logger;