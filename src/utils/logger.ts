import moment from "moment";
import fs from 'fs';

const logFile = `server.log`;

class Logger {

   static log(info: any, color: any) {
      const message = `[${moment().format("lll")}] --> ${info}`;
      fs.appendFileSync(logFile, message + "\n");
      color ? console.log(message[color]) : console.log(message);
   }

   static error(err: any) {
      const error = `[${moment().format("lll")}] --> ${err.stack ? err.stack : err}`;
      fs.appendFileSync(logFile, error + "\n");
      console.error(error["red"]);
   }

   static warn(info: any) {
      const message = `[${moment().format("lll")}] --> ${info}`;
      fs.appendFileSync(logFile, message + "\n");
      console.warn(message["yellow"]);
   }

   static info(info: any) {
      const message = `[${moment().format("lll")}] --> ${info}`;
      fs.appendFileSync(logFile, message + "\n");
      console.info(message["blue"]);
   }

   static debug(info: any) {
      const message = `[${moment().format("lll")}] --> ${info}`;
      fs.appendFileSync(logFile, message + "\n");
      console.debug(message["green"]);
   }
}

export default Logger;