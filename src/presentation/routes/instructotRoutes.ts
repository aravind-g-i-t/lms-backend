import { instructorController } from "@setup/container/instructor/instructorController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const instructorRouter=express.Router();


instructorRouter.get(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructorProfile(req,res,next));

instructorRouter.patch(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfile(req,res,next));

instructorRouter.patch(ROUTES.IMAGE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfileImage(req,res,next));

instructorRouter.patch(ROUTES.EXPERTISE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateExpertise(req,res,next));

instructorRouter.patch(ROUTES.RESUME,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateResume(req,res,next));

instructorRouter.patch(ROUTES.PASSWORD,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updatePassword(req,res,next));

instructorRouter.post(ROUTES.VERIFICATION,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.applyForVerification(req,res,next));


instructorRouter.post(ROUTES.VERIFICATION,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.applyForVerification(req,res,next));




export default instructorRouter