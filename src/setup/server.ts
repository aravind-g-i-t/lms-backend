import 'module-alias/register';
import app from "./expressApp";
import dotenv from 'dotenv';
import { connectMongoDB } from "@infrastructure/database/mongoDB/mongoConnection";
import { logger } from "@infrastructure/logging/Logger";
import http from 'http'
import { initializeSockets } from "./socket";
import { startCronScheduler } from "@infrastructure/schedulers/scheduler.cron";
import { connectRedis } from '@infrastructure/database/redis/redisConnection';


const env=process.env.NODE_ENV || 'production'
dotenv.config({path: `.env.${env}`});

const PORT=process.env.PORT || 5000;

async function startServer() {
    try {
        await connectMongoDB();

        await connectRedis()

        startCronScheduler();

        const server=http.createServer(app);
        initializeSockets(server)

        server.listen(PORT, ()=>{
            logger.info(`Server running in ${env} mode at port ${PORT}`)
        })

    } catch  {
        logger.error("Server startup failed");
        process.exit(1)
    }
}

startServer()