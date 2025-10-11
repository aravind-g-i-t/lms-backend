import { logger } from '@infrastructure/logging/Logger';
import mongoose from 'mongoose';

export const connectMongoDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI || '';
        
        if (!uri) {
            logger.error("Missing MONGODB_URI in .env");
            process.exit(1);
        }

        mongoose.connection.on("connected", () => {
            logger.info("Mongoose connected to DB");
        });
        
        mongoose.connection.on("error", () => {
            logger.error(" Mongoose connection error:");
        });
        await mongoose.connect(uri);

    } catch {
        logger.error('Mongo connection error');
        process.exit(1);
    }
};
