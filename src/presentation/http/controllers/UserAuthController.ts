
import { RefreshTokenResponseDTO } from "@presentation/dtos/shared/RefreshToken";
import { UserSigninResponseDTO } from "@presentation/dtos/shared/Signin";
import { UserSignupResponseDTO } from "@presentation/dtos/shared/Signup";
import { IBusinessSigninUseCase } from "@application/IUseCases/business/IBusinessSigninUseCase";
import { IBusinessGoogleSigninUseCase } from "@application/IUseCases/business/IGoogleSignin";
import { IInstructorGoogleSigninUseCase } from "@application/IUseCases/instructor/IGoogleSignin";
import { IInstructorSigninUseCase } from "@application/IUseCases/instructor/IInstructrorSigninUseCase";
import { ILearnerGoogleSigninUseCase } from "@application/IUseCases/learner/IGoogleSignin";
import { ILearnerSigninUseCase } from "@application/IUseCases/learner/ILearnerSigninUseCase";
import { IRefreshTokenUseCase } from "@application/IUseCases/shared/IRefreshToken";
import { IResendOTPUseCase } from "@application/IUseCases/shared/IResendOTPUseCase";
import { IResetPasswordUseCase } from "@application/IUseCases/shared/IResetPassword";
import { IUserSignupUseCase } from "@application/IUseCases/shared/ISignupUseCase";
import { IUserOTPVerificationUseCase } from "@application/IUseCases/shared/IUserOTPVerification";
import { IVerifyEmailUseCase } from "@application/IUseCases/shared/IVerifyEmail";

import { logger } from "@infrastructure/logging/Logger";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";

import { Response, NextFunction } from "express"
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";





export class UserAuthController {
    constructor(

        private _userSignupUseCase: IUserSignupUseCase,

        private _learnerOTPVerificationUseCase: IUserOTPVerificationUseCase,

        private _instructorOTPVerificationUseCase: IUserOTPVerificationUseCase,

        private _businessOTPVerificationUseCase: IUserOTPVerificationUseCase,

        private _resendOTPUseCase: IResendOTPUseCase,

        private _learnerSigninUseCase: ILearnerSigninUseCase,

        private _instructorSigninUseCase: IInstructorSigninUseCase,

        private _businessSigninUseCase: IBusinessSigninUseCase,

        private _userRefreshTokenUseCase: IRefreshTokenUseCase,

        private _learnerGoogleSigninUseCase: ILearnerGoogleSigninUseCase,

        private _instructorGoogleSigninUseCase: IInstructorGoogleSigninUseCase,

        private _businessGoogleSigninUseCase: IBusinessGoogleSigninUseCase,

        private _verifyEmailUseCase: IVerifyEmailUseCase,

        private _otpVerificationUseCase: IUserOTPVerificationUseCase,

        private _resetPasswordUseCase: IResetPasswordUseCase
    ) { }

    signup = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("User signup request recieved");
            const result = await this._userSignupUseCase.execute(req.body);

            const response: UserSignupResponseDTO = {
                success: true,
                message: MESSAGES.OTP_SENT,
                otpExpiresAt: result.otpExpiresAt,
                email: result.email,
                role: result.role
            }
            logger.info("OTP sent to learner email successfully");
            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            logger.warn("User signup failed");
            next(error)
        }
    }


    verifyOTP = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("OTP verification request recieved for user signup");
            const { role, email, otp } = req.body;
            let message;
            if (role === 'learner') {
                message = MESSAGES.LEARNER_CREATED
                await this._learnerOTPVerificationUseCase.execute({ email, otp })
            } else if (role === 'instructor') {
                message = MESSAGES.INSTRUCTOR_CREATED
                await this._instructorOTPVerificationUseCase.execute({ email, otp })
            } else {
                message = MESSAGES.BUSINESS_CREATED
                await this._businessOTPVerificationUseCase.execute({ email, otp })
            }
            logger.info("User registration completed.");
            res.status(STATUS_CODES.CREATED).json({ success: true, message });

        } catch (error) {
            logger.warn("Failed to verify OTP for user registration.");
            next(error)
        }
    }

    resendOTP = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Recieved request to resend OTP for email verification.");
            const email = req.body.email;
            const result = await this._resendOTPUseCase.execute(email);
            logger.info("OTP was resent successfully,");
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: true,
                otpExpiresAt: result
            });

        } catch (error) {
            logger.warn("Failed to resend OTP.");
            next(error)
        }
    }

    signin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("User signin request recieved");
            const role: 'learner' | 'instructor' | 'business' = req.body.role;

            let result;
            let user;


            switch (role) {
                case "learner":
                    result = await this._learnerSigninUseCase.execute(req.body);
                    user = result.user
                    break;

                case "instructor":
                    result = await this._instructorSigninUseCase.execute(req.body);
                    user = result.user
                    break;
                case "business":
                    result = await this._businessSigninUseCase.execute(req.body);
                    user = result.user
                    break;
            }



            if (!result || !user) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            logger.info("User signed in successfully");
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000
            });


            const response: UserSigninResponseDTO = {
                success: true,
                message: MESSAGES.LOGIN_SUCCESS,
                user,
                accessToken: result.accessToken,
                role: result.role
            }

            res.status(STATUS_CODES.OK).json(response);


        } catch (error) {
            logger.warn("User failed to sign in.");
            next(error)
        }
    }

    logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("User logout request recieved");
            if (!req.cookies?.refreshToken) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.NO_SESSION,
                });
                return;
            }
            logger.info("User logged out successfully.");
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(STATUS_CODES.OK).json({
                success: true,
                message: MESSAGES.LOGOUT_SUCCESS,
            });
        } catch (error) {
            next(error)
        }
    }

    refreshToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Token refresh request recieved");
            const refreshToken = req.cookies?.refreshToken

            if (!refreshToken) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.SESSION_EXPIRED,
                });
                return;
            }


            const accessToken = await this._userRefreshTokenUseCase.execute(refreshToken);

            const response: RefreshTokenResponseDTO = {
                success: true,
                message: MESSAGES.REFRESH_TOKEN_SUCCESS,
                accessToken
            }
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000
            });
            logger.info("Access token refreshed successfully");
            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            logger.warn("Failed to refresh access token.");
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            next(error)
        }
    }


    googleSignin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Google signin request recieved.");
            const { role, token } = req.body

            let result;

            switch (role) {
                case "learner": {
                    const learnerResult = await this._learnerGoogleSigninUseCase.execute(token);
                    result = {
                        ...learnerResult,
                        user: learnerResult.user,
                    };
                    break;
                }
                case "instructor": {
                    const instructorResult = await this._instructorGoogleSigninUseCase.execute(token);
                    result = {
                        ...instructorResult,
                        user: instructorResult.user,
                    };
                    break;
                }
                case "business": {
                    const businessResult = await this._businessGoogleSigninUseCase.execute(token);
                    result = {
                        ...businessResult,
                        user: businessResult.user,
                    };
                    break;
                }
            }

            if (!result) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            logger.info("User singed in via google authentication successfully.");
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });

            const response = {
                success: true,
                message: MESSAGES.LOGIN_SUCCESS,
                user: result.user,
                accessToken: result.accessToken,
                role
            };

            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            logger.warn("Google sign in failed.");
            next(error);
        }
    };

    verifyEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Email verification request recieved");
            const { email, role } = req.body;
            const result = await this._verifyEmailUseCase.execute(email, role);

            res.status(STATUS_CODES.OK).json({
                success: true,
                message: 'Email verification successful.',
                otpExpiresAt: result
            });
            logger.info("OTP sent to user email successfully")

        } catch (error) {
            logger.warn("Failed to sent OTP for email verification");
            next(error)
        }
    }

    verifyResetOTP = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("OTP verification request recieved for password reset");
            const { email, otp } = req.body;
            await this._otpVerificationUseCase.execute({ otp, email })
            logger.info("OTP verificaiton successfull")
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: 'OTP verification success',
            });

        } catch (error) {
            logger.warn("Failed to verify OTP")
            next(error)
        }
    }

    resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.info("Password reset request recieved")
            const { email, role, password } = req.body;
            await this._resetPasswordUseCase.execute(role, email, password);
            logger.info("Password reset successfully successfully")
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Password updated successfully",
            });

        } catch (error) {
            logger.warn("Failed to reset user password.")
            next(error)
        }
    }
}