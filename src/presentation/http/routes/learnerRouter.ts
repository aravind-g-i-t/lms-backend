import { UpdateLearnerProfileRequestSchema } from "@presentation/dtos/learner/UpdateProfile";
import { UpdatePasswordSchema } from "@presentation/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@presentation/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/http/middlewares/validateRequest";

import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
import { learnerAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import { enrollmentController, learnerController, progressController, reviewController } from "@setup/container/learner/controllers";
import { courseController, messageController } from "@setup/container/shared/controllers";
import { liveSessionController, quizController } from "@setup/container/instructor/controllers";
const learnerRouter=express.Router();

// Learner profile

learnerRouter.get(ROUTES.PROFILE,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.getLearnerProfile(req,res,next));

// Update learner profile

learnerRouter.patch(ROUTES.PROFILE,learnerAuthMiddleware,validateRequest(UpdateLearnerProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfile(req,res,next));

// Update learner profile Image

learnerRouter.patch(ROUTES.IMAGE,learnerAuthMiddleware,validateRequest(UpdateUserProfileImageRequestSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updateProfileImage(req,res,next));

// Update learner password

learnerRouter.patch(ROUTES.PASSWORD,learnerAuthMiddleware,validateRequest(UpdatePasswordSchema),(req:Request,res:Response,next:NextFunction)=>learnerController.updatePassword(req,res,next));

learnerRouter.get(ROUTES.COURSES,(req:Request,res:Response,next:NextFunction)=>courseController.getCoursesForLearner(req,res,next));

learnerRouter.get("/course/preview",(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetailsForLearner(req,res,next));


learnerRouter.get("/enrollments",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>enrollmentController.getEnrollments(req,res,next));

learnerRouter.get("/course/learn",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getFullCourseForLearner(req,res,next));

learnerRouter.get("/course/checkout",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetailsForCheckout(req,res,next));

learnerRouter.patch("/progress/chapter/complete",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>progressController.markChapterAsCompleted(req,res,next));

learnerRouter.patch("/progress/chapter/current",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>progressController.updateCurrentChapter(req,res,next));

learnerRouter.post("/favourites",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.addToFavourites(req,res,next));

learnerRouter.delete("/favourites/:courseId",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.removeFromFavourites(req,res,next));

learnerRouter.get("/favourites",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getFavourites(req,res,next));


learnerRouter.get("/conversations",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getConversationsForLearner(req,res,next))

learnerRouter.get("/messages",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getMessages(req,res,next))

learnerRouter.get("/quiz",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.getQuizForLearner(req,res,next));

learnerRouter.post("/quiz",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.submitQuiz(req,res,next))

learnerRouter.get("/certificates",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.getCertificates(req,res,next));

learnerRouter.get("/video",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getVideo(req,res,next));

learnerRouter.get("/courses/:courseId/modules/:moduleId/chapters/:chapterId/stream",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.streamVideo(req,res,next));

learnerRouter.get("/ping",learnerAuthMiddleware,(req:Request,res:Response)=>res.json({success:true,message:"Pinged learner route successfully"}));


learnerRouter.post("/messages/delete",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.deleteMessages(req,res,next));

learnerRouter.post("/session/join",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.joinLiveSession(req,res,next));

learnerRouter.get("/sessions",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.getSessionsForLearner(req,res,next));

learnerRouter.post("/course/review",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>reviewController.addReview(req,res,next));

learnerRouter.get("/course/reviews",learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>reviewController.getReviewsForLearner(req,res,next));

export default learnerRouter;