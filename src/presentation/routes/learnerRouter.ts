import { UpdateLearnerProfileRequestSchema } from "@application/dtos/learner/UpdateProfile";
import { ResetUserPasswordRequestSchema } from "@application/dtos/shared/ResetUserPassword";
// import { UpdatePasswordSchema } from "@application/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@application/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { learnerController } from "@setup/container/learner/learnerController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const learnerRouter=express.Router();

// Learner profile

learnerRouter.get(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.getLearnerProfile(req,res,next));

// Update learner profile

learnerRouter.patch(ROUTES.PROFILE,userAuthMiddleware,validateRequest(UpdateLearnerProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfile(req,res,next));

// Update learner profile Image

learnerRouter.patch(ROUTES.IMAGE,userAuthMiddleware,validateRequest(UpdateUserProfileImageRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfileImage(req,res,next));

// Update learner password

learnerRouter.patch(ROUTES.PASSWORD,userAuthMiddleware,validateRequest(ResetUserPasswordRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updatePassword(req,res,next));


export default learnerRouter;