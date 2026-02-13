import { Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AuthenticatedRequest } from "@presentation/http/middlewares/createAuthMiddleware";

import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";
import { IUserSignupUseCase } from "@application/IUseCases/shared/ISignupUseCase";
import { IUserOTPVerificationUseCase } from "@application/IUseCases/shared/IUserOTPVerification";
import { IResendOTPUseCase } from "@application/IUseCases/shared/IResendOTPUseCase";
import { ILearnerSigninUseCase } from "@application/IUseCases/learner/ILearnerSigninUseCase";
import { IInstructorSigninUseCase } from "@application/IUseCases/instructor/IInstructrorSigninUseCase";
import { IBusinessSigninUseCase } from "@application/IUseCases/business/IBusinessSigninUseCase";
import { IRefreshTokenUseCase } from "@application/IUseCases/shared/IRefreshToken";
import { ILearnerGoogleSigninUseCase } from "@application/IUseCases/learner/IGoogleSignin";
import { IInstructorGoogleSigninUseCase } from "@application/IUseCases/instructor/IGoogleSignin";
import { IBusinessGoogleSigninUseCase } from "@application/IUseCases/business/IGoogleSignin";
import { IVerifyEmailUseCase } from "@application/IUseCases/shared/IVerifyEmail";
import { IResetPasswordUseCase } from "@application/IUseCases/shared/IResetPassword";
import { logger } from "@infrastructure/logging/Logger";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "production"}` });

const accessTokenCookieMaxAge = Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE);
const refreshTokenCookieMaxAge = Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE);

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

    signup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const result = await this._userSignupUseCase.execute(req.body);

            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success(MESSAGES.OTP_SENT, {
                    otpExpiresAt: result.otpExpiresAt,
                    email: result.email,
                    role: result.role,
                })
            );
        } catch (error) {
            next(error);
        }
    };

    verifyOTP = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { role, email, otp } = req.body;

            if (role === "learner") {
                await this._learnerOTPVerificationUseCase.execute({ email, otp });
                res.status(STATUS_CODES.CREATED).json(
                    ResponseBuilder.success(MESSAGES.ACCOUNT_CREATED_SUCCESS)
                );
                return;
            }

            if (role === "instructor") {
                await this._instructorOTPVerificationUseCase.execute({ email, otp });
                res.status(STATUS_CODES.CREATED).json(
                    ResponseBuilder.success(MESSAGES.ACCOUNT_CREATED_SUCCESS)
                );
                return;
            }

            await this._businessOTPVerificationUseCase.execute({ email, otp });
            res.status(STATUS_CODES.CREATED).json(
                ResponseBuilder.success(MESSAGES.ACCOUNT_CREATED_SUCCESS)
            );
        } catch (error) {
            next(error);
        }
    };

    resendOTP = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const otpExpiresAt = await this._resendOTPUseCase.execute(req.body.email);

            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success(MESSAGES.OTP_SENT, { otpExpiresAt })
            );
        } catch (error) {
            next(error);
        }
    };

    signin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { role } = req.body;
            let result;

            if (role === "learner") result = await this._learnerSigninUseCase.execute(req.body);
            if (role === "instructor") result = await this._instructorSigninUseCase.execute(req.body);
            if (role === "business") result = await this._businessSigninUseCase.execute(req.body);

            if (!result) {
                throw new AppError(MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
            }

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: refreshTokenCookieMaxAge,
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: accessTokenCookieMaxAge,
            });

            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success(MESSAGES.LOGIN_SUCCESS, {
                    user: result.user,
                    accessToken: result.accessToken,
                    role: result.role,
                })
            );
        } catch (error) {
            next(error);
        }
    };

    logout = async (_: AuthenticatedRequest, res: Response) => {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        res.status(STATUS_CODES.OK).json(
            ResponseBuilder.success(MESSAGES.LOGOUT_SUCCESS)
        );
    };

    refreshToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new AppError(MESSAGES.SESSION_EXPIRED, STATUS_CODES.BAD_REQUEST);
            }

            const accessToken = await this._userRefreshTokenUseCase.execute(refreshToken);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: accessTokenCookieMaxAge,
            });

            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success(MESSAGES.REFRESH_TOKEN_SUCCESS, { accessToken })
            );
        } catch (error) {
            next(error);
        }
    };

    verifyEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const otpExpiresAt = await this._verifyEmailUseCase.execute(
                req.body.email,
                req.body.role
            );

            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success("Email verification successful", { otpExpiresAt })
            );
        } catch (error) {
            next(error);
        }
    };

    verifyResetOTP = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            await this._otpVerificationUseCase.execute(req.body);
            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success("OTP verification success")
            );
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { email, role, password } = req.body;
            await this._resetPasswordUseCase.execute(role, email, password);

            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success("Password updated successfully")
            );
        } catch (error) {
            next(error);
        }
    };

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
                maxAge: refreshTokenCookieMaxAge,
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: accessTokenCookieMaxAge,
            });

            // const response = {
            //     success: true,
            //     message: MESSAGES.LOGIN_SUCCESS,
            //     user: result.user,
            //     accessToken: result.accessToken,
            //     role
            // };

            res.status(STATUS_CODES.OK).json(
                ResponseBuilder.success(MESSAGES.LOGIN_SUCCESS, {
                    user: result.user,
                    accessToken: result.accessToken,
                    role
                })
            );
        } catch (error) {
            logger.warn("Google sign in failed.");
            next(error);
        }
    };
}
