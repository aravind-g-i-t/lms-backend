import pino from "pino";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

class Logger {
    private logger;

    constructor() {
        this.logger = pino(
            {
                level: process.env.NODE_ENV === "production" ? "info" : "debug",
                transport: {
                    target: "pino-pretty",
                    options: { colorize: true, translateTime: "SYS:standard" }
                }
            },
            pino.destination(path.join(logDir, "app.log"))
        );
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
