import { GetCoursesForInstructorRequestSchema } from "@presentation/dtos/course/GetCoursesForInstructor";
import { UpdateInstructorExpertiseRequestSchema } from "@presentation/dtos/instructor/UpdateExpertise";
import { UpdateInstructorProfileRequestSchema } from "@presentation/dtos/instructor/UpdateProfile";
import { UpdatePasswordSchema } from "@presentation/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@presentation/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/http/middlewares/validateRequest";
import { categoryController } from "@setup/container/admin/controllers";
import { instructorController, liveSessionController, quizController } from "@setup/container/instructor/controllers";
import { courseController, messageController } from "@setup/container/shared/controllers";
import { instructorAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const instructorRouter=express.Router();

// Instructor profile

instructorRouter.get(ROUTES.PROFILE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructorProfile(req,res,next));

// Update instructor profile

instructorRouter.patch(ROUTES.PROFILE,instructorAuthMiddleware,validateRequest(UpdateInstructorProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfile(req,res,next));

// Update instructor profile image

instructorRouter.patch(ROUTES.IMAGE,instructorAuthMiddleware,validateRequest(UpdateUserProfileImageRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfileImage(req,res,next));

// Update instructor expertise

instructorRouter.patch(ROUTES.EXPERTISE,instructorAuthMiddleware,validateRequest(UpdateInstructorExpertiseRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateExpertise(req,res,next));

// Update instructor resume

instructorRouter.patch(ROUTES.RESUME,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateResume(req,res,next));

// Update instructor id proof

instructorRouter.patch(ROUTES.ID_PROOF,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateIDProof(req,res,next));

// Update instructor password

instructorRouter.patch(ROUTES.PASSWORD,instructorAuthMiddleware,validateRequest(UpdatePasswordSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updatePassword(req,res,next));

// Apply for instructor verification

instructorRouter.post(ROUTES.VERIFICATION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.applyForVerification(req,res,next));



instructorRouter.post(ROUTES.COURSE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.createCourse(req,res,next))


instructorRouter.get(ROUTES.CATEGORIES,(req:Request,res:Response,next:NextFunction)=>categoryController.getCategoryOptions(req,res,next));

instructorRouter.get(ROUTES.COURSES,instructorAuthMiddleware,validateRequest(GetCoursesForInstructorRequestSchema),(req:Request,res:Response,next:NextFunction)=>courseController.getCoursesForInstructor(req,res,next));


instructorRouter.get(ROUTES.COURSE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetails(req,res,next));


instructorRouter.patch(ROUTES.COURSE_INFO,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateCourseInfo(req,res,next));

instructorRouter.patch(ROUTES.COURSE_THUMBNAIL,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateThumbnail(req,res,next));

instructorRouter.patch(ROUTES.COURSE_PREVIEW_VIDEO,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updatePreviewVideo(req,res,next));

instructorRouter.patch(ROUTES.COURSE_PREREQUISITES,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updatePrerequisites(req,res,next));

instructorRouter.patch(ROUTES.COURSE_TAGS,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateTags(req,res,next));

instructorRouter.patch(ROUTES.COURSE_OBJECTIVES,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateWhatYouWillLearn(req,res,next));

instructorRouter.patch(ROUTES.ADD_MODULE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.addModule(req,res,next));

instructorRouter.patch(ROUTES.ADD_CHAPTER,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.addChapter(req,res,next));

instructorRouter.patch(ROUTES.UPDATE_CHAPTER,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateChapter(req,res,next));

instructorRouter.patch(ROUTES.UPDATE_VIDEO,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateVideo(req,res,next));

instructorRouter.patch(ROUTES.UPDATE_MODULE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateModule(req,res,next));

instructorRouter.patch(ROUTES.DELETE_MODULE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteModule(req,res,next));

instructorRouter.patch(ROUTES.DELETE_CHAPTER,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteChapter(req,res,next));

instructorRouter.patch(ROUTES.COURSE_VERIFICATION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.submitForReview(req,res,next));

instructorRouter.patch(ROUTES.COURSE_STATUS,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateStatus(req,res,next));

instructorRouter.patch(ROUTES.ADD_RESOURCE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.addResource(req,res,next));

instructorRouter.patch(ROUTES.DELETE_RESOURCE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteResource(req,res,next));

instructorRouter.post(ROUTES.COURSE_QUIZ,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.createQuiz(req,res,next));

instructorRouter.patch(ROUTES.COURSE_QUIZ,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.updateQuiz(req,res,next));

instructorRouter.post(ROUTES.COURSE_QUIZ_QUESTION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.addQuestion(req,res,next));

instructorRouter.patch(ROUTES.COURSE_QUIZ_QUESTION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.updateQuestion(req,res,next));

instructorRouter.delete(ROUTES.COURSE_QUIZ_QUESTION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.deleteQuestion(req,res,next));

instructorRouter.delete(ROUTES.COURSE_QUIZ,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.deleteQuiz(req,res,next));

instructorRouter.get(ROUTES.CONVERSATIONS,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getConversationsForInstructor(req,res,next));

instructorRouter.get(ROUTES.MESSAGES,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getMessages(req,res,next));

instructorRouter.post(ROUTES.DELETE_MESSAGE,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.deleteMessages(req,res,next));

instructorRouter.get(ROUTES.COURSE_OPTIONS,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseOptions(req,res,next));

instructorRouter.post(ROUTES.SESSION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.createLiveSession(req,res,next));

instructorRouter.get(ROUTES.SESSIONS,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.getSessionsForInstructor(req,res,next));

instructorRouter.post(ROUTES.START_SESSION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.startLiveSession(req,res,next));

instructorRouter.post(ROUTES.END_SESSION,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>liveSessionController.endLiveSession(req,res,next));

instructorRouter.get(ROUTES.EARNINGS,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.getEarnings(req,res,next));

instructorRouter.get(ROUTES.DASHBOARD,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.getDashboard(req,res,next));

export default instructorRouter;