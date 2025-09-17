
import { AdminSigninRequestSchema } from "@application/dtos/admin/Signin";
import { GetBusinessesRequestSchema } from "@application/dtos/business/GetBusinesses";
import { GetInstructorsRequestSchema } from "@application/dtos/instructor/GetInstructors";
import { GetLearnersRequestSchema } from "@application/dtos/learner/GetLearners";
import { UpdateUserStatusRequestSchema } from "@application/dtos/shared/UpdateUserStatus";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { adminAuthMiddleware } from "@setup/container/admin/adminAuthMiddleware";
import { adminController } from "@setup/container/admin/adminController";
import { businessController } from "@setup/container/business/businessController";
import { instructorController } from "@setup/container/instructor/instructorController";
import { learnerController } from "@setup/container/learner/learnerController";
import express, { Request, Response,NextFunction } from "express";
const adminRouter=express.Router();


adminRouter.post('/signin',(req:Request,res:Response,next:NextFunction)=>adminController.signin(req,res,next));

adminRouter.post('/logout',(req:Request,res:Response,next:NextFunction)=>adminController.logout(req,res,next));

adminRouter.get('/learners',adminAuthMiddleware,validateRequest(GetLearnersRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.getLearners(req,res,next));

adminRouter.get('/businesses',adminAuthMiddleware,validateRequest(GetBusinessesRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.getBusinesses(req,res,next));

adminRouter.get('/instructors',adminAuthMiddleware,validateRequest(GetInstructorsRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructors(req,res,next));

adminRouter.patch('/learner/status',adminAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateLearnerStatus(req,res,next));

adminRouter.patch('/instructor/status',adminAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateInstructorStatus(req,res,next));

adminRouter.patch('/business/status',adminAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updateBusinessStatus(req,res,next));

adminRouter.post('/refresh',(req:Request,res:Response,next:NextFunction)=>adminController.refreshToken(req,res,next));





export default adminRouter;