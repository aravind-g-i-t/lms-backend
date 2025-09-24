
import { OTPVerificationResponseDTO } from "@application/dtos/shared/OTPVerification";
import { RefreshTokenResponseDTO } from "@application/dtos/shared/RefreshToken";
import { UserSigninResponseDTO } from "@application/dtos/shared/Signin";
import { UserSignupResponseDTO } from "@application/dtos/shared/Signup";
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

        private _verifyEmailUseCase:IVerifyEmailUseCase,

        private _otpVerificationUseCase:IUserOTPVerificationUseCase,

        private _resetPasswordUseCase:IResetPasswordUseCase
    ) { }

    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const result = await this._userSignupUseCase.execute(req.body);
            console.log(req.body);
            
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
            let message;
            if (role === 'learner') {
                message=MESSAGES.LEARNER_CREATED
                await this._learnerOTPVerificationUseCase.execute(req.body)
            } else if (role === 'instructor') {
                message=MESSAGES.INSTRUCTOR_CREATED
                await this._instructorOTPVerificationUseCase.execute(req.body)
            } else {
                message=MESSAGES.BUSINESS_CREATED
                await this._businessOTPVerificationUseCase.execute(req.body)
            }
            res.status(STATUS_CODES.CREATED).json({success:true,message});

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
            let user;


            switch (role) {
                case "learner":
                    result = await this._learnerSigninUseCase.execute(req.body);
                    user=LearnerDTOMapper.toSigninDTO(result.user)
                    break;
                    
                case "instructor":
                    result = await this._instructorSigninUseCase.execute(req.body);
                    user=InstructorDTOMapper.toSigninDTO(result.user)
                    break;
                case "business":
                    result = await this._businessSigninUseCase.execute(req.body);
                    user=BusinessDTOMapper.toSigninDTO(result.user)
                    break;
            }
            console.log(result);
            console.log(user);
            
            
            if(!result || !user){
                throw new AppError(MESSAGES.SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            console.log('result', result);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
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
            next(error)
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.cookies?.refreshToken) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    success: false,
                    message: MESSAGES.NO_SESSION,
                });
                return;
            }

            res.clearCookie("refreshToken", {
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

            const refreshToken = req.cookies?.refreshToken
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
            res.clearCookie("refreshToken", {
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

            res.cookie("refreshToken", result.refreshToken, {
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