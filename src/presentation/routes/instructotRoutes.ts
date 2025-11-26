import { GetCoursesForInstructorRequestSchema } from "@presentation/dtos/course/GetCoursesForInstructor";
import { UpdateInstructorExpertiseRequestSchema } from "@presentation/dtos/instructor/UpdateExpertise";
import { UpdateInstructorProfileRequestSchema } from "@presentation/dtos/instructor/UpdateProfile";
import { UpdatePasswordSchema } from "@presentation/dtos/shared/UpdatePassword";
import { UpdateUserProfileImageRequestSchema } from "@presentation/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { instructorController } from "@setup/container/instructor/instructorController";
import { categoryController } from "@setup/container/shared/categoryController";
import { courseController } from "@setup/container/shared/courseController";
import { userAuthMiddleware } from "@setup/container/shared/userAuthMiddleware";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const instructorRouter=express.Router();

// Instructor profile

instructorRouter.get(ROUTES.PROFILE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.getInstructorProfile(req,res,next));

// Update instructor profile

instructorRouter.patch(ROUTES.PROFILE,userAuthMiddleware,validateRequest(UpdateInstructorProfileRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfile(req,res,next));

// Update instructor profile image

instructorRouter.patch(ROUTES.IMAGE,userAuthMiddleware,validateRequest(UpdateUserProfileImageRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateProfileImage(req,res,next));

// Update instructor expertise

instructorRouter.patch(ROUTES.EXPERTISE,userAuthMiddleware,validateRequest(UpdateInstructorExpertiseRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updateExpertise(req,res,next));

// Update instructor resume

instructorRouter.patch(ROUTES.RESUME,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateResume(req,res,next));

// Update instructor id proof

instructorRouter.patch(ROUTES.ID_PROOF,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.updateIDProof(req,res,next));

// Update instructor password

instructorRouter.patch(ROUTES.PASSWORD,userAuthMiddleware,validateRequest(UpdatePasswordSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updatePassword(req,res,next));

// Apply for instructor verification

instructorRouter.post(ROUTES.VERIFICATION,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.applyForVerification(req,res,next));



instructorRouter.post(ROUTES.COURSE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.createCourse(req,res,next))


instructorRouter.get(ROUTES.CATEGORIES,(req:Request,res:Response,next:NextFunction)=>categoryController.getCategoryOptions(req,res,next));

instructorRouter.get(ROUTES.COURSES,userAuthMiddleware,validateRequest(GetCoursesForInstructorRequestSchema),(req:Request,res:Response,next:NextFunction)=>courseController.getCoursesForInstructor(req,res,next));


instructorRouter.get(ROUTES.COURSE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.getCourseDetails(req,res,next));


instructorRouter.patch(ROUTES.COURSE_INFO,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateCourseInfo(req,res,next));

instructorRouter.patch(ROUTES.COURSE_THUMBNAIL,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateThumbnail(req,res,next));

instructorRouter.patch(ROUTES.COURSE_PREVIEW_VIDEO,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updatePreviewVideo(req,res,next));

instructorRouter.patch(ROUTES.COURSE_PREREQUISITES,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updatePrerequisites(req,res,next));

instructorRouter.patch(ROUTES.COURSE_TAGS,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateTags(req,res,next));

instructorRouter.patch(ROUTES.COURSE_OBJECTIVES,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateWhatYouWillLearn(req,res,next));

instructorRouter.patch(ROUTES.ADD_MODULE,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.addModule(req,res,next));

instructorRouter.patch(ROUTES.ADD_CHAPTER,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.addChapter(req,res,next));

instructorRouter.patch("/course/chapter/update",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateChapter(req,res,next));

instructorRouter.patch("/course/video/update",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateVideo(req,res,next));

instructorRouter.patch("/course/module/update",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateModule(req,res,next));

instructorRouter.patch("/course/module/delete",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteModule(req,res,next));

instructorRouter.patch("/course/chapter/delete",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.deleteChapter(req,res,next));

instructorRouter.patch("/course/verification",userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.submitForReview(req,res,next));

instructorRouter.patch(ROUTES.COURSE_STATUS,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>courseController.updateStatus(req,res,next));


export default instructorRouter