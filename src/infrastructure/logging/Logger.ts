import pino from "pino";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

class Logger {
    private logger;

    constructor() {
        const logFile = path.join(logDir, "app.log");
        this.logger = pino({
            level: process.env.NODE_ENV === "production" ?
                "info" : "debug",
            transport: {
                targets: [
                    {
                        target: "pino-pretty", options: { colorize: true, translateTime: "SYS:standard" }
                    }, { target: "pino/file", options: { destination: logFile } }]
                }
        });
    }
    
    info(message: string) {
        this.logger.info(message);
    } 
    
    warn(message: string) {
        this.logger.warn(message);
    } 
    
    error(message: string) {
        this.logger.error(message);
    } 
    debug(message: string) {
        this.logger.debug(message);
    }
}

export const logger = new Logger();
