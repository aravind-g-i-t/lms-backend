import app from "./expressApp";
import dotenv from 'dotenv';
import { connectMongoDB } from "@infrastructure/database/mongoDB/mongoConnection";
import { logger } from "@infrastructure/logging/Logger";


const env=process.env.NODE_ENV || 'production'
dotenv.config({path: `.env.${env}`});

const PORT=process.env.PORT || 5000;

async function startServer() {
    try {
        await connectMongoDB();
        

        app.listen(PORT, ()=>{
            logger.info(`Server running in ${env} mode at port ${PORT}`)
        })
    } catch  {
        logger.error("Server startup failed");
        process.exit(1)
    }
}

startServer()