
import { AdminSigninRequestSchema } from "@presentation/dtos/admin/Signin";
import { GetBusinessesRequestSchema } from "@presentation/dtos/business/GetBusinesses";
import { GetBusinessForAdminRequestSchema } from "@presentation/dtos/business/GetBusinessForAdmin";
import { GetCategoriesRequestSchema } from "@presentation/dtos/category/GetCategories";
import { GetAllCouponsRequestSchema } from "@presentation/dtos/coupon/GetAllCoupons";
import { GetCoursesForAdminRequestSchema } from "@presentation/dtos/course/GetCoursesForAdmin";
import { GetInstructorForAdminRequestSchema } from "@presentation/dtos/instructor/GetInstructorForAdmin";
import { GetInstructorsRequestSchema } from "@presentation/dtos/instructor/GetInstructors";
import { GetLearnerForAdminRequestSchema } from "@presentation/dtos/learner/GetLearnerForAdmin";
import { GetLearnersRequestSchema } from "@presentation/dtos/learner/GetLearners";
import { UpdateUserStatusRequestSchema } from "@presentation/dtos/shared/UpdateUserStatus";
import { UpdateUserVerificationStatusRequestSchema } from "@presentation/dtos/shared/UpdateVerificationStatus";
import { validateRequest } from "@presentation/http/middlewares/validateRequest";



import express, { Request, Response,NextFunction } from "express";
import { ROUTES } from "shared/constants/routes";
import { adminAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import { adminController, categoryController, couponController } from "@setup/container/admin/controllers";
import { learnerController } from "@setup/container/learner/controllers";
import { businessController } from "@setup/container/business/controllers";
import { instructorController } from "@setup/container/instructor/controllers";
import { courseController } from "@setup/container/shared/controllers";
const adminRouter=express.Router();

// Admin signin

adminRouter.post(ROUTES.SIGNIN,validateRequest(AdminSigninRequestSchema),(req:Request,res:Response,next:NextFunction)=>adminController.signin(req,res,next));

// Admin logout

adminRouter.post(ROUTES.LOGOUT,(req:Request,res:Response,next:NextFunction)=>adminController.logout(req,res,next));

// Get learners

adminRouter.get(ROUTES.LEARNERS,adminAuthMiddleware,validateRequest(GetLearnersRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.getLearners(req,res,next));

// Get businesses

adminRouter.get(ROUTES.BUSINESSES,validateRequest(GetBusinessesRequestSchema),adminAuthMiddleware,validateRequest(GetBusinessesRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.getBusinesses(req,res,next));

// get Instructors

adminRouter.get(ROUTES.INSTRUCTORS,adminAuthMiddleware,validateRequest(GetInstructorsRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructors(req,res,next));

// Update learner status

adminRouter.patch(ROUTES.LEARNER_STATUS,adminAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateLearnerStatus(req,res,next));

// Update instructor status

adminRouter.patch(ROUTES.INSTRUCTOR_STATUS,adminAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateInstructorStatus(req,res,next));

// Update business status

adminRouter.patch(ROUTES.BUSINESS_STATUS,adminAuthMiddleware,validateRequest(UpdateUserStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updateBusinessStatus(req,res,next));

// Get business details

adminRouter.get(ROUTES.BUSINESS_DATA,adminAuthMiddleware,validateRequest(GetBusinessForAdminRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.getBusinessDataForAdmin(req,res,next));

// Get instructor details

adminRouter.get(ROUTES.INSTRUCTOR_DATA,adminAuthMiddleware,validateRequest(GetInstructorForAdminRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructorProfileForAdmin(req,res,next));

// Get learner details

adminRouter.get(ROUTES.LEARNER_DATA,adminAuthMiddleware,validateRequest(GetLearnerForAdminRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.getLearnerDataForAdmin(req,res,next));

// Update instructor verification status

adminRouter.patch(ROUTES.INSTRUCTOR_VERIFICATION,adminAuthMiddleware,validateRequest(UpdateUserVerificationStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateVerificationStatus(req,res,next));

// Update business verification status

adminRouter.patch(ROUTES.BUSINESS_VERIFICATION,adminAuthMiddleware,validateRequest(UpdateUserVerificationStatusRequestSchema),(req:Request,res:Response,next:NextFunction)=>businessController.updateVerificationStatus(req,res,next));

// Add category

adminRouter.post(ROUTES.CATEGORY,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>categoryController.addCategory(req,res,next));

// Get all categories

adminRouter.get(ROUTES.CATEGORIES,adminAuthMiddleware,validateRequest(GetCategoriesRequestSchema),(req:Request,res:Response,next:NextFunction)=>categoryController.getAllCategories(req,res,next));

// Update category

adminRouter.put(ROUTES.CATEGORY,(req:Request,res:Response,next:NextFunction)=>categoryController.updateCategory(req,res,next));

// Update categoryStatus

adminRouter.patch(ROUTES.CATEGORY_STATUS,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>categoryController.updateStatus(req,res,next));



adminRouter.patch(ROUTES.COURSE_VERIFICATION,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateVerification(req,res,next));


adminRouter.get(ROUTES.COURSES,adminAuthMiddleware, validateRequest(GetCoursesForAdminRequestSchema),(req:Request,res:Response,next:NextFunction)=>courseController.getCoursesForAdmin(req,res,next));

adminRouter.post("/coupon",adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>couponController.createCoupon(req,res,next));

adminRouter.get(ROUTES.COUPONS,adminAuthMiddleware,validateRequest(GetAllCouponsRequestSchema),(req:Request,res:Response,next:NextFunction)=>couponController.getAllCoupons(req,res,next));

adminRouter.put(ROUTES.COUPON,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>couponController.updateCoupon(req,res,next));

adminRouter.patch(ROUTES.COUPON_STATUS,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>couponController.updateStatus(req,res,next));

adminRouter.get(ROUTES.COURSE,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetails(req,res,next));

adminRouter.get(ROUTES.DASHBOARD,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>adminController.getDashboard(req,res,next));

adminRouter.get(ROUTES.COURSE_ANALYTICS,adminAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseAnalytics(req,res,next));


export default adminRouter;