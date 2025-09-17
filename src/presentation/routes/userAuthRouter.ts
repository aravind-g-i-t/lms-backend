import { OTPVerificationRequestSchema } from "@application/dtos/shared/OTPVerification";
import { UserSigninRequestSchema } from "@application/dtos/shared/Signin";
import { UserSignupRequestSchema } from "@application/dtos/shared/Signup";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { userAuthController } from "@setup/container/shared/userAuthController";
import express, { Request, Response ,NextFunction} from "express";
const userAuthRouter=express.Router();

userAuthRouter.post('/signup',(req:Request,res:Response,next:NextFunction)=>userAuthController.signup(req,res,next));

userAuthRouter.post('/otp/send',(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyOTP(req,res,next));

userAuthRouter.post('/otp/resend',(req:Request,res:Response,next:NextFunction)=>userAuthController.resendOTP(req,res,next))

userAuthRouter.post('/signin',(req:Request,res:Response,next:NextFunction)=>userAuthController.signin(req,res,next))

userAuthRouter.post('/logout',(req:Request,res:Response,next:NextFunction)=>userAuthController.logout(req,res,next))

userAuthRouter.post('/refresh',(req:Request,res:Response,next:NextFunction)=>userAuthController.refreshToken(req,res,next))

userAuthRouter.post('/google',(req:Request,res:Response,next:NextFunction)=>userAuthController.googleSignin(req,res,next))

userAuthRouter.post('/reset/email',(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyEmail(req,res,next))

userAuthRouter.post('/reset/otp',(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyResetOTP(req,res,next))

userAuthRouter.post('/reset',(req:Request,res:Response,next:NextFunction)=>userAuthController.resetPassword(req,res,next))

export default userAuthRouter;