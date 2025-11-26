import { enrollmentController } from "@setup/container/enrollment";
import { paymentController } from "@setup/container/payment";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { NextFunction, Request, Response } from "express";


const paymentRoutes = express.Router();

paymentRoutes.post("/initiate", userAuthMiddleware,(req:Request,res:Response,next:NextFunction) =>enrollmentController.initiateEnrollment(req,res,next) )

paymentRoutes.get("/verify", userAuthMiddleware,(req:Request,res:Response,next:NextFunction) =>paymentController.verifyPayment(req,res,next) )

export default paymentRoutes;