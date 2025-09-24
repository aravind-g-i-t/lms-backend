import { instructorController } from "@setup/container/instructor/instructorController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
const instructorRouter=express.Router();


instructorRouter.get('/profile',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructorProfile(req,res,next));

instructorRouter.patch('/profile',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfile(req,res,next));

instructorRouter.patch('/profile/image',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfileImage(req,res,next));

instructorRouter.patch('/profile/expertise',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateExpertise(req,res,next));

instructorRouter.patch('/profile/resume',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateResume(req,res,next));

instructorRouter.patch('/password',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updatePassword(req,res,next));

instructorRouter.post('/verification',userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.applyForVerification(req,res,next));




export default instructorRouter