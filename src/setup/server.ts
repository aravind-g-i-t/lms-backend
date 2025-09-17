import app from "./expressApp";
import dotenv from 'dotenv';
import { connectMongoDB } from "@infrastructure/database/mongoDB/mongoConnection";


const env=process.env.NODE_ENV || 'production'
dotenv.config({path: `.env.${env}`});

const PORT=process.env.PORT || 5000;

async function startServer() {
    try {
        await connectMongoDB();
        

        app.listen(PORT, ()=>{
            console.log(`Server running in ${env} mode at port ${PORT}`)
        })
    } catch (error) {
        console.error("Server startup failed:",error);
        process.exit(1)
    }
}

startServer()