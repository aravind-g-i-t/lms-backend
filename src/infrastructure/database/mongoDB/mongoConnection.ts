import mongoose from 'mongoose';

export const connectMongoDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI || '';
        console.log(uri);
        
        if (!uri) {
            console.error("Missing MONGODB_URI in .env");
            process.exit(1);
        }

        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to DB");
        });
        
        mongoose.connection.on("error", (err) => {
            console.error(" Mongoose connection error:", err);
        });
        await mongoose.connect(uri);

    } catch (err) {
        console.error('Mongo connection error',err);
        process.exit(1);
    }
};
