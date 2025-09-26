import { UpdateLearnerProfileRequestSchema } from "@application/dtos/learner/UpdateProfile";
import { UpdatePasswordSchema } from "@application/dtos/shared/UpdatePassword";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { learnerController } from "@setup/container/learner/learnerController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const learnerRouter=express.Router();


learnerRouter.get(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.getLearnerProfile(req,res,next));

learnerRouter.patch(ROUTES.PROFILE,userAuthMiddleware,validateRequest(UpdateLearnerProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfile(req,res,next));

learnerRouter.patch(ROUTES.IMAGE,userAuthMiddleware,validateRequest(UpdateLearnerProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfileImage(req,res,next));

learnerRouter.patch(ROUTES.PASSWORD,(req:Request,res:Response,next:NextFunction)=>learnerController.updatePassword(req,res,next));

export default learnerRouter;