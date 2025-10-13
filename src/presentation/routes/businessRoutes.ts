import { UpdateBusinessProfileRequestSchema } from "@presentation/dtos/business/UpdateProfile";
import { UpdatePasswordSchema } from "@presentation/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@presentation/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { businessController } from "@setup/container/business/businessController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const businessRouter=express.Router();

// Business profile

businessRouter.get(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.getBusinessProfile(req,res,next));

// Update business profile

businessRouter.patch(ROUTES.PROFILE,validateRequest(UpdateBusinessProfileRequestSchema),userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateProfile(req,res,next));

// Update business profile image

businessRouter.patch(ROUTES.IMAGE,userAuthMiddleware,validateRequest(UpdateUserProfileImageRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updateProfileImage(req,res,next));

// Update business license

businessRouter.patch(ROUTES.LICENSE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateLicense(req,res,next));

// Update business password

businessRouter.patch(ROUTES.PASSWORD,userAuthMiddleware,validateRequest(UpdatePasswordSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updatePassword(req,res,next));

// Apply for business verification

businessRouter.post(ROUTES.VERIFICATION,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.applyForVerification(req,res,next));

export default businessRouter;