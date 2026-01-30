import { enrollmentController } from "@setup/container/learner/controllers";
import { paymentController } from "@setup/container/shared/controllers";
import { learnerAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { NextFunction, Request, Response } from "express";
import { ROUTES } from "shared/constants/routes";


const paymentRoutes = express.Router();

paymentRoutes.post(ROUTES.INITIATE, learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction) =>enrollmentController.initiateEnrollment(req,res,next) )

paymentRoutes.get(ROUTES.VERIFY, learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction) =>paymentController.verifyPayment(req,res,next) )

export default paymentRoutes; 