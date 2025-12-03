import { UpdateLearnerProfileRequestSchema } from "@presentation/dtos/learner/UpdateProfile";
import { UpdatePasswordSchema } from "@presentation/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@presentation/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { enrollmentController } from "@setup/container/enrollment";
import { learnerController } from "@setup/container/learner/learnerController";
import { progressController } from "@setup/container/progress";
import { courseController } from "@setup/container/shared/courseController";
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

learnerRouter.patch(ROUTES.PASSWORD,userAuthMiddleware,validateRequest(UpdatePasswordSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updatePassword(req,res,next));

learnerRouter.get(ROUTES.COURSES,(req:Request,res:Response,next:NextFunction)=>courseController.getCoursesForLearner(req,res,next));

learnerRouter.get("/course/preview",(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetailsForLearner(req,res,next));


learnerRouter.get("/enrollments",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>enrollmentController.getEnrollments(req,res,next));

learnerRouter.get("/course/learn",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getFullCourseForLearner(req,res,next));

learnerRouter.get("/course/checkout",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetailsForCheckout(req,res,next));

learnerRouter.patch("/progress/chapter/complete",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>progressController.markChapterAsCompleted(req,res,next));

learnerRouter.post("/favourites",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.addToFavourites(req,res,next));

learnerRouter.delete("/favourites/:courseId",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.removeFromFavourites(req,res,next));

learnerRouter.get("/favourites",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getFavourites(req,res,next));

export default learnerRouter;