
import { OTPVerificationResponseDTO } from "@application/dtos/shared/OTPVerification";
import { RefreshTokenResponseDTO } from "@application/dtos/shared/RefreshToken";
import { UserSigninResponseDTO } from "@application/dtos/shared/Signin";
import { UserSignupResponseDTO } from "@application/dtos/shared/Signup";
import { BusinessDTOMapper } from "@application/mappers/BusinessMapper";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { LearnerDTOMapper } from "@application/mappers/LearnerMapper";
import { BusinessGoogleSigninUseCase } from "@application/useCases/business/GoogleSignin";
import { BusinessOTPVerificationUseCase } from "@application/useCases/business/OTPVerification";
import { BusinessSigninUseCase } from "@application/useCases/business/Signin";
import { InstructorGoogleSigninUseCase } from "@application/useCases/instructor/GoogleSignin";
import { InstructorOTPVerificationUseCase } from "@application/useCases/instructor/OTPVerification";
import { InstructorSigninUseCase } from "@application/useCases/instructor/Signin";
import { LearnerGoogleSigninUseCase } from "@application/useCases/learner/GoogleSignin";
import { LearnerOTPVerificationUseCase } from "@application/useCases/learner/OTPVerification";
import { LearnerSigninUseCase } from "@application/useCases/learner/Signin";
import { UserRefreshTokenUseCase } from "@application/useCases/shared/RefreshToken";
import { ResendOTPUseCase } from "@application/useCases/shared/ResendOTP";
import { ResetPasswordUseCase } from "@application/useCases/shared/ResetPassword";
import { UserSignupUseCase } from "@application/useCases/shared/Signup";
import { VerifyEmailUseCase } from "@application/useCases/shared/VerifyEmail";
import { OTPVerificationUseCase } from "@application/useCases/shared/VerifyOTP";
import { BusinessMapper } from "@infrastructure/database/mongoDB/mappers/BusinessMapper";
import { LearnerMapper } from "@infrastructure/database/mongoDB/mappers/LearnerMapper";
import { Request, Response, NextFunction } from "express"
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";





export class UserAuthController {
    constructor(
        private _userSignupUseCase: UserSignupUseCase,
        private _learnerOTPVerificationUseCase: LearnerOTPVerificationUseCase,
        private _instructorOTPVerificationUseCase: InstructorOTPVerificationUseCase,
        private _businessOTPVerificationUseCase: BusinessOTPVerificationUseCase,
        private _resendOTPUseCase: ResendOTPUseCase,
        private _learnerSigninUseCase: LearnerSigninUseCase,
        private _instructorSigninUseCase: InstructorSigninUseCase,
        private _businessSigninUseCase: BusinessSigninUseCase,
        private _userRefreshTokenUseCase: UserRefreshTokenUseCase,
        private _learnerGoogleSigninUseCase: LearnerGoogleSigninUseCase,
        private _instructorGoogleSigninUseCase: InstructorGoogleSigninUseCase,
        private _businessGoogleSigninUseCase: BusinessGoogleSigninUseCase,
        private _verifyEmailUseCase:VerifyEmailUseCase,
        private _otpVerificationUseCase:OTPVerificationUseCase,
        private _resetPasswordUseCase:ResetPasswordUseCase
    ) { }

    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const result = await this._userSignupUseCase.execute(req.body);
            console.log(result)
            const response: UserSignupResponseDTO = {
                success: true,
                message: MESSAGES.OTP_SENT,
                otpExpiresAt: result.otpExpiresAt,
                email: result.email,
                role: result.role
            }
            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            next(error)
        }
    }

    verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { role } = req.body;
            let result: OTPVerificationResponseDTO;
            if (role === 'learner') {
                result = await this._learnerOTPVerificationUseCase.execute(req.body)
            } else if (role === 'instructor') {
                result = await this._instructorOTPVerificationUseCase.execute(req.body)
            } else {
                result = await this._businessOTPVerificationUseCase.execute(req.body)
            }
            console.log(result)
            res.status(STATUS_CODES.CREATED).json(result);

        } catch (error) {
            next(error)
        }
    }

    resendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const email = req.body.email;
            let result = await this._resendOTPUseCase.execute(email)
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: true,
                otpExpiresAt: result
            });

        } catch (error) {
            next(error)
        }
    }

    signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const role: 'learner' | 'instructor' | 'business' = req.body.role;
            console.log('req body', req.body);

            let result;
            switch (role) {
                case "learner":
                    result = await this._learnerSigninUseCase.execute(req.body);
                    break;
                case "instructor":
                    result = await this._instructorSigninUseCase.execute(req.body);
                    break;
                case "business":
                    result = await this._businessSigninUseCase.execute(req.body);
                    break;
            }
            console.log('result', result);

            res.cookie("userRefreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const response: UserSigninResponseDTO = {
                success: true,
                message: MESSAGES.LOGIN_SUCCESS,
                user: result.user,
                accessToken: result.accessToken,
                role: result.role
            }

            res.status(STATUS_CODES.OK).json(response);


        } catch (error) {
            next(error)
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.cookies?.userRefreshToken) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.NO_SESSION,
                });
                return;
            }

            res.clearCookie("userRefreshToken", {
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

    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log('entered refresh');

            const refreshToken = req.cookies?.userRefreshToken
            console.log('token', refreshToken);

            if (!refreshToken) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.SESSION_EXPIRED,
                });
                return;
            }


            const accessToken = await this._userRefreshTokenUseCase.execute(refreshToken);
            console.log('accessToken', accessToken);

            const response: RefreshTokenResponseDTO = {
                success: true,
                message: MESSAGES.REFRESH_TOKEN_SUCCESS,
                accessToken
            }

            res.status(STATUS_CODES.OK).json(response);
        } catch (error) {
            res.clearCookie("userRefreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            next(error)
        }
    }


    googleSignin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {role,token}= req.body
            console.log('req body', req.body);

            let result;

            switch (role) {
                case "learner": {
                    const learnerResult = await this._learnerGoogleSigninUseCase.execute(token);
                    result = {
                        ...learnerResult,
                        user: LearnerDTOMapper.toSigninDTO(learnerResult.user), // DTO here
                    };
                    break;
                }
                case "instructor": {
                    const instructorResult = await this._instructorGoogleSigninUseCase.execute(token);
                    result = {
                        ...instructorResult,
                        user: InstructorDTOMapper.toSigninDTO(instructorResult.user),
                    };
                    break;
                }
                case "business": {
                    const businessResult = await this._businessGoogleSigninUseCase.execute(token);
                    result = {
                        ...businessResult,
                        user: BusinessDTOMapper.toSigninDTO(businessResult.user),
                    };
                    break;
                }
            }

            console.log('result', result);
            if(!result){
                throw new AppError(MESSAGES.SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
            }

            res.cookie("userRefreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
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
            next(error);
        }
    };

    verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {email,role} = req.body;
            let result = await this._verifyEmailUseCase.execute(email,role)
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: 'Email verification successful.',
                otpExpiresAt: result
            });

        } catch (error) {
            next(error)
        }
    }

    verifyResetOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {email,otp} = req.body;
            await this._otpVerificationUseCase.execute({otp,email})
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: 'OTP verification success',
            });

        } catch (error) {
            next(error)
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {email,role,password} = req.body;
            await this._resetPasswordUseCase.execute(role,email,password)
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Password updated successfully",
            });

        } catch (error) {
            next(error)
        }
    }

}