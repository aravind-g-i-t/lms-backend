
import { AdminSigninRequestSchema } from "@application/dtos/admin/Signin";
import { GetBusinessesRequestSchema } from "@application/dtos/business/GetBusinesses";
import { GetBusinessForAdminRequestSchema } from "@application/dtos/business/GetBusinessForAdmin";
import { GetInstructorForAdminRequestSchema } from "@application/dtos/instructor/GetInstructorForAdmin";
import { GetInstructorsRequestSchema } from "@application/dtos/instructor/GetInstructors";
import { GetLearnerForAdminRequestSchema } from "@application/dtos/learner/GetLearnerForAdmin";
import { GetLearnersRequestSchema } from "@application/dtos/learner/GetLearners";
import { UpdateUserStatusRequestSchema } from "@application/dtos/shared/UpdateUserStatus";
import { UpdateUserVerificationStatusRequestSchema } from "@application/dtos/shared/UpdateVerificationStatus";
import { validateRequest } from "@presentation/middlewares/validateRequest";


import { adminController } from "@setup/container/admin/adminController";
import { businessController } from "@setup/container/business/businessController";
import { instructorController } from "@setup/container/instructor/instructorController";
import { learnerController } from "@setup/container/learner/learnerController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";

import express, { Request, Response,NextFunction } from "express";
import { ROUTES } from "shared/constants/routes";
const adminRouter=express.Router();

// Admin signin

adminRouter.post(ROUTES.SIGNIN,validateRequest(AdminSigninRequestSchema),(req:Request,res:Response,next:NextFunction)=>adminController.signin(req,res,next));

// Admin logout

adminRouter.post(ROUTES.LOGOUT,(req:Request,res:Response,next:NextFunction)=>adminController.logout(req,res,next));

// Get learners

adminRouter.get(ROUTES.LEARNERS,userAuthMiddleware,validateRequest(GetLearnersRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.getLearners(req,res,next));

// Get businesses

adminRouter.get(ROUTES.BUSINESSES,validateRequest(GetBusinessesRequestSchema),userAuthMiddleware,validateRequest(GetBusinessesRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.getBusinesses(req,res,next));

// get Instructors

adminRouter.get(ROUTES.INSTRUCTORS,userAuthMiddleware,validateRequest(GetInstructorsRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructors(req,res,next));

// Update learner status

adminRouter.patch(ROUTES.LEARNER_STATUS,userAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateLearnerStatus(req,res,next));

// Update instructor status

adminRouter.patch(ROUTES.INSTRUCTOR_STATUS,userAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateInstructorStatus(req,res,next));

// Update business status

adminRouter.patch(ROUTES.BUSINESS_STATUS,userAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updateBusinessStatus(req,res,next));

// Get business details

adminRouter.get(ROUTES.BUSINESS_DATA,userAuthMiddleware,validateRequest(GetBusinessForAdminRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.getBusinessDataForAdmin(req,res,next));

// Get instructor details

adminRouter.get(ROUTES.INSTRUCTOR_DATA,userAuthMiddleware,validateRequest(GetInstructorForAdminRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructorProfileForAdmin(req,res,next));

// Get learner details

adminRouter.get(ROUTES.LEARNER_DATA,userAuthMiddleware,validateRequest(GetLearnerForAdminRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.getLearnerDataForAdmin(req,res,next));

// Update instructor verification status

adminRouter.patch(ROUTES.INSTRUCTOR_VERIFICATION,userAuthMiddleware,validateRequest(UpdateUserVerificationStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateVerificationStatus(req,res,next));

// Update business verification status

adminRouter.patch(ROUTES.BUSINESS_VERIFICATION,userAuthMiddleware,validateRequest(UpdateUserVerificationStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updateVerificationStatus(req,res,next));





export default adminRouter;