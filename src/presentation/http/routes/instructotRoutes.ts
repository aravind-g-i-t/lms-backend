import { GetCoursesForInstructorRequestSchema } from "@presentation/dtos/course/GetCoursesForInstructor";
import { UpdateInstructorExpertiseRequestSchema } from "@presentation/dtos/instructor/UpdateExpertise";
import { UpdateInstructorProfileRequestSchema } from "@presentation/dtos/instructor/UpdateProfile";
import { UpdatePasswordSchema } from "@presentation/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@presentation/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/http/middlewares/validateRequest";
import { instructorController } from "@setup/container/instructor/instructorController";
import { quizController } from "@setup/container/quiz";
import { categoryController } from "@setup/container/shared/categoryController";
import { courseController } from "@setup/container/course";
import { instructorAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
import { messageController } from "@setup/container/message";
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

instructorRouter.patch("/course/chapter/update",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateChapter(req,res,next));

instructorRouter.patch("/course/video/update",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateVideo(req,res,next));

instructorRouter.patch("/course/module/update",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateModule(req,res,next));

instructorRouter.patch("/course/module/delete",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteModule(req,res,next));

instructorRouter.patch("/course/chapter/delete",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteChapter(req,res,next));

instructorRouter.patch("/course/verification",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.submitForReview(req,res,next));

instructorRouter.patch(ROUTES.COURSE_STATUS,instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateStatus(req,res,next));

instructorRouter.patch("/course/resource/add",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.addResource(req,res,next));

instructorRouter.patch("/course/resource/delete",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteResource(req,res,next));

instructorRouter.post("/course/quiz",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.createQuiz(req,res,next));

instructorRouter.patch("/course/quiz",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.updateQuiz(req,res,next));

instructorRouter.post("/course/quiz/question",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.addQuestion(req,res,next));

instructorRouter.patch("/course/quiz/question",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.updateQuestion(req,res,next));

instructorRouter.delete("/course/quiz/question",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.deleteQuestion(req,res,next));

instructorRouter.delete("/course/quiz",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>quizController.deleteQuiz(req,res,next));

instructorRouter.get("/conversations",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getConversationsForInstructor(req,res,next));

instructorRouter.get("/messages",instructorAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>messageController.getMessages(req,res,next));


export default instructorRouter