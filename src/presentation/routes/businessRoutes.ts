import { businessController } from "@setup/container/business/businessController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const businessRouter=express.Router();


businessRouter.get(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.getBusinessProfile(req,res,next));

businessRouter.patch(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateProfile(req,res,next));

businessRouter.patch(ROUTES.IMAGE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateProfileImage(req,res,next));

businessRouter.patch(ROUTES.PASSWORD,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updatePassword(req,res,next));

export default businessRouter;