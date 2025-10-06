import { UpdateInstructorExpertiseRequestSchema } from "@application/dtos/instructor/UpdateExpertise";
import { UpdateInstructorProfileRequestSchema } from "@application/dtos/instructor/UpdateProfile";
import { ResetUserPasswordRequestSchema } from "@application/dtos/shared/ResetUserPassword";
import { UpdateUserProfileImageRequestSchema } from "@application/dtos/shared/UpdateProfileImage";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { instructorController } from "@setup/container/instructor/instructorController";
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

instructorRouter.patch(ROUTES.PASSWORD,userAuthMiddleware,validateRequest(ResetUserPasswordRequestSchema),(req:Request,res:Response,next:NextFunction)=>instructorController.updatePassword(req,res,next));

// Apply for instructor verification

instructorRouter.post(ROUTES.VERIFICATION,userAuthMiddleware,(req:Request,res:Response,next:NextFunction)=>instructorController.applyForVerification(req,res,next));







export default instructorRouter