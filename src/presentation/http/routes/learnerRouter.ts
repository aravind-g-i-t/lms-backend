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

learnerRouter.get(ROUTES.COURSE_PREVIEW,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetailsForLearner(req,res,next));


learnerRouter.get(ROUTES.ENROLLMENTS,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>enrollmentController.getEnrollments(req,res,next));

learnerRouter.get(ROUTES.LEARN_COURSE,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getFullCourseForLearner(req,res,next));

learnerRouter.get(ROUTES.CHECKOUT,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetailsForCheckout(req,res,next));

learnerRouter.patch(ROUTES.PROGRESS_CHAPTER_COMPLETE,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>progressController.markChapterAsCompleted(req,res,next));

learnerRouter.patch(ROUTES.PROGRESS_CHAPTER_CURRENT,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>progressController.updateCurrentChapter(req,res,next));

learnerRouter.post(ROUTES.FAVOURITES,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.addToFavourites(req,res,next));

learnerRouter.delete(ROUTES.FAVOURITE_COURSE,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.removeFromFavourites(req,res,next));

learnerRouter.get(ROUTES.FAVOURITES,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getFavourites(req,res,next));


learnerRouter.get(ROUTES.CONVERSATIONS,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getConversationsForLearner(req,res,next))

learnerRouter.get(ROUTES.MESSAGES,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getMessages(req,res,next))

learnerRouter.get(ROUTES.QUIZ,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.getQuizForLearner(req,res,next));

learnerRouter.post(ROUTES.QUIZ,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.submitQuiz(req,res,next))

learnerRouter.get(ROUTES.CERTIFICATES,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.getCertificates(req,res,next));

learnerRouter.get(ROUTES.VIDEO,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getVideo(req,res,next));

learnerRouter.get(ROUTES.COURSE_VIDEO_STREAM,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.streamVideo(req,res,next));

learnerRouter.get(ROUTES.PING,learnerAuthMiddleware,(req:Request,res:Response)=>res.json({success:true,message:"Pinged learner route successfully"}));


learnerRouter.post(ROUTES.DELETE_MESSAGE,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.deleteMessages(req,res,next));

learnerRouter.post(ROUTES.JOIN_SESSION,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.joinLiveSession(req,res,next));

learnerRouter.get(ROUTES.SESSIONS,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.getSessionsForLearner(req,res,next));

learnerRouter.post(ROUTES.COURSE_REVIEW,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>reviewController.addReview(req,res,next));

learnerRouter.get(ROUTES.COURSE_REVIEWS,(req:Request,res:Response,next:NextFunction)=>reviewController.getReviewsForLearner(req,res,next));

learnerRouter.get(ROUTES.HOME,(req:Request,res:Response,next:NextFunction)=>learnerController.getHomePageData(req,res,next));

learnerRouter.get(ROUTES.HOME_LEARNER_DATA,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.getLearnerHomeData(req,res,next));

learnerRouter.get(ROUTES.POPULAR_COURSES,(req:Request,res:Response,next:NextFunction)=>courseController.getPopularCourses(req,res,next));

learnerRouter.patch(ROUTES.COURSE_REVIEW,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>reviewController.updateReview(req,res,next));

learnerRouter.patch(ROUTES.CANCEL_ENROLLMENT,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>enrollmentController.cancelEnrollment(req,res,next));

learnerRouter.get(ROUTES.WALLET,learnerAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>learnerController.getWalletData(req,res,next));


export default learnerRouter;