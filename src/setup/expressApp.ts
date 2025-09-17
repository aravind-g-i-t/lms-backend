import express from 'express';
import type {Request,Response,NextFunction} from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from '@presentation/routes/appRouter';
import { errorHandler } from '@presentation/middlewares/errorHandler';

const env=process.env.NODE_ENV || 'production'
dotenv.config({path: `.env.${env}`});

const app=express();

app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));
app.use(express.json());

app.use('/api/v1',router);

app.use((req:Request,res:Response)=>{
    res.status(404).json({message:'Route not found'})
})

app.use(errorHandler);

export default app;