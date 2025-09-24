import { UpdateLearnerProfileRequestSchema } from "@application/dtos/learner/UpdateProfile";
import { UpdatePasswordSchema } from "@application/dtos/shared/UpdatePassword";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { learnerController } from "@setup/container/learner/learnerController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
const learnerRouter=express.Router();


learnerRouter.get('/profile',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.getLearnerProfile(req,res,next));

learnerRouter.patch('/profile',userAuthMiddleware,validateRequest(UpdateLearnerProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfile(req,res,next));

learnerRouter.patch('/profile/image',userAuthMiddleware,validateRequest(UpdateLearnerProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfileImage(req,res,next));

learnerRouter.patch('/password',(req:Request,res:Response,next:NextFunction)=>learnerController.updatePassword(req,res,next));

export default learnerRouter;