import { UpdateBusinessProfileRequestSchema } from "@presentation/dtos/business/UpdateProfile";
import { UpdatePasswordSchema } from "@presentation/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@presentation/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/http/middlewares/validateRequest";
import { businessController } from "@setup/container/business/businessController";
import { businessAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const businessRouter=express.Router();

// Business profile

businessRouter.get(ROUTES.PROFILE,businessAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.getBusinessProfile(req,res,next));

// Update business profile

businessRouter.patch(ROUTES.PROFILE,validateRequest(UpdateBusinessProfileRequestSchema),businessAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateProfile(req,res,next));

// Update business profile image

businessRouter.patch(ROUTES.IMAGE,businessAuthMiddleware,validateRequest(UpdateUserProfileImageRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updateProfileImage(req,res,next));

// Update business license

businessRouter.patch(ROUTES.LICENSE,businessAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateLicense(req,res,next));

// Update business password

businessRouter.patch(ROUTES.PASSWORD,businessAuthMiddleware,validateRequest(UpdatePasswordSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updatePassword(req,res,next));

// Apply for business verification

businessRouter.post(ROUTES.VERIFICATION,businessAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.applyForVerification(req,res,next));

export default businessRouter;