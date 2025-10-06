import { GoogleSigninRequestSchema } from "@application/dtos/shared/GoogleSignin";
import { OTPVerificationRequestSchema } from "@application/dtos/shared/OTPVerification";
import { ResendOTPRequestSchema } from "@application/dtos/shared/ResendOTP";
import { SetUserPasswordRequestSchema } from "@application/dtos/shared/SetPassword";
import { UserSigninRequestSchema } from "@application/dtos/shared/Signin";
import { UserSignupRequestSchema } from "@application/dtos/shared/Signup";
import { VerifyEmailRequestSchema } from "@application/dtos/shared/VerifyEmail";
import { VerifyOTPForResetRequestSchema } from "@application/dtos/shared/VerifyOTPForPasswordReset";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import { userAuthController } from "@setup/container/shared/userAuthController";
import express, { Request, Response ,NextFunction} from "express";
import { ROUTES } from "shared/constants/routes";
const userAuthRouter=express.Router();

// user signup

userAuthRouter.post(ROUTES.SIGNUP,validateRequest(UserSignupRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.signup(req,res,next));

// signup-otp verification

userAuthRouter.post(ROUTES.SEND_OTP,validateRequest(OTPVerificationRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyOTP(req,res,next));

// resend otp

userAuthRouter.post(ROUTES.RESEND_OPT,validateRequest(ResendOTPRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.resendOTP(req,res,next))

// user signin

userAuthRouter.post(ROUTES.SIGNIN,validateRequest(UserSigninRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.signin(req,res,next))

// user logout

userAuthRouter.post(ROUTES.LOGOUT,(req:Request,res:Response,next:NextFunction)=>userAuthController.logout(req,res,next))

// token refresh

userAuthRouter.post(ROUTES.REFRESH,(req:Request,res:Response,next:NextFunction)=>userAuthController.refreshToken(req,res,next))

// google authentication

userAuthRouter.post(ROUTES.GOOGLE_AUTH,validateRequest(GoogleSigninRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.googleSignin(req,res,next))

// email verification to reset password

userAuthRouter.post(ROUTES.RESET_EMAIL_VERIFICATION,validateRequest(VerifyEmailRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyEmail(req,res,next))

// otp verification to reset password

userAuthRouter.post(ROUTES.RESET_OTP_VERIFICATION,validateRequest(VerifyOTPForResetRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.verifyResetOTP(req,res,next));

// reset password

userAuthRouter.post(ROUTES.RESET_PASSWORD,validateRequest(SetUserPasswordRequestSchema),(req:Request,res:Response,next:NextFunction)=>userAuthController.resetPassword(req,res,next));

export default userAuthRouter;