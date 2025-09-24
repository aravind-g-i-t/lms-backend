import { businessController } from "@setup/container/business/businessController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
const businessRouter=express.Router();


businessRouter.get('/profile',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.getBusinessProfile(req,res,next));

businessRouter.patch('/profile',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateProfile(req,res,next));

businessRouter.patch('/profile/image',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateProfileImage(req,res,next));

businessRouter.patch('/password',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updatePassword(req,res,next));

export default businessRouter;