import { OTPVerificationRequestSchema } from "@application/dtos/shared/OTPVerification";
import { UserSigninRequestSchema } from "@application/dtos/shared/Signin";
import { UserSignupRequestSchema } from "@application/dtos/shared/Signup";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { userAuthController } from "@setup/container/shared/userAuthController";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const userAuthRouter=express.Router();

userAuthRouter.post(ROUTES.SIGNUP,(req:Request,res:Response,next:NextFunction)=>userAuthController.signup(req,res,next));

userAuthRouter.post(ROUTES.SEND_OTP,(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyOTP(req,res,next));

userAuthRouter.post(ROUTES.RESEND_OPT,(req:Request,res:Response,next:NextFunction)=>userAuthController.resendOTP(req,res,next))

userAuthRouter.post(ROUTES.SIGNIN,(req:Request,res:Response,next:NextFunction)=>userAuthController.signin(req,res,next))

userAuthRouter.post(ROUTES.LOGOUT,(req:Request,res:Response,next:NextFunction)=>userAuthController.logout(req,res,next))

userAuthRouter.post(ROUTES.REFRESH,(req:Request,res:Response,next:NextFunction)=>userAuthController.refreshToken(req,res,next))

userAuthRouter.post(ROUTES.GOOGLE_AUTH,(req:Request,res:Response,next:NextFunction)=>userAuthController.googleSignin(req,res,next))

userAuthRouter.post(ROUTES.RESET_EMAIL_VERIFICATION,(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyEmail(req,res,next))

userAuthRouter.post(ROUTES.RESET_OTP_VERIFICATION,(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyResetOTP(req,res,next))

userAuthRouter.post(ROUTES.RESET_PASSWORD,(req:Request,res:Response,next:NextFunction)=>userAuthController.resetPassword(req,res,next))

export default userAuthRouter;