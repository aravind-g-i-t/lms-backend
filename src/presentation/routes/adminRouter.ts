
import { AdminSigninRequestSchema } from "@application/dtos/admin/Signin";
import { GetBusinessesRequestSchema } from "@application/dtos/business/GetBusinesses";
import { GetInstructorsRequestSchema } from "@application/dtos/instructor/GetInstructors";
import { GetLearnersRequestSchema } from "@application/dtos/learner/GetLearners";
import { UpdateUserStatusRequestSchema } from "@application/dtos/shared/UpdateUserStatus";
import { validateRequest } from "@presentation/middlewares/validateRequest";
// import { userAuthMiddleware } from "@setup/container/admin/adminAuthMiddleware";

import { adminController } from "@setup/container/admin/adminController";
import { businessController } from "@setup/container/business/businessController";
import { instructorController } from "@setup/container/instructor/instructorController";
import { learnerController } from "@setup/container/learner/learnerController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";

import express, { Request, Response,NextFunction } from "express";
import { ROUTES } from "shared/constants/routes";
const adminRouter=express.Router();


adminRouter.post(ROUTES.SIGNIN,(req:Request,res:Response,next:NextFunction)=>adminController.signin(req,res,next));

adminRouter.post(ROUTES.LOGOUT,(req:Request,res:Response,next:NextFunction)=>adminController.logout(req,res,next));

adminRouter.get(ROUTES.LEARNERS,userAuthMiddleware,validateRequest(GetLearnersRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.getLearners(req,res,next));

adminRouter.get(ROUTES.BUSINESSES,userAuthMiddleware,validateRequest(GetBusinessesRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.getBusinesses(req,res,next));

adminRouter.get(ROUTES.INSTRUCTORS,userAuthMiddleware,validateRequest(GetInstructorsRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructors(req,res,next));

adminRouter.patch(ROUTES.LEARNER_STATUS,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.updateLearnerStatus(req,res,next));

adminRouter.patch(ROUTES.INSTRUCTOR_STATUS,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateInstructorStatus(req,res,next));

adminRouter.patch(ROUTES.BUSINESS_STATUS,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>businessController.updateBusinessStatus(req,res,next));

adminRouter.post(ROUTES.REFRESH,(req:Request,res:Response,next:NextFunction)=>adminController.refreshToken(req,res,next));

adminRouter.get("/verifications/instructors",(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructorVerifications(req,res,next));



export default adminRouter;