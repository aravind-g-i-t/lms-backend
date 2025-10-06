import { UserSignupUseCase } from "@application/useCases/shared/Signup";
import { UserAuthController } from "@presentation/controllers/UserAuthController";
import { learnerRepository } from "../learner/learnerRepository";
import { instructorRepository } from "../instructor/instructorRepository";
import { businessRepository } from "../business/businessRepository";
import { nodemailerService } from "./nodemailerService";
import { cacheService } from "./cacheService";
import { LearnerOTPVerificationUseCase } from "@application/useCases/learner/OTPVerification";
import { InstructorOTPVerificationUseCase } from "@application/useCases/instructor/OTPVerification";
import { BusinessOTPVerificationUseCase } from "@application/useCases/business/OTPVerification";
import { ResendOTPUseCase } from "@application/useCases/shared/ResendOTP";
import { LearnerSigninUseCase } from "@application/useCases/learner/Signin";
import { tokenService } from "./tokenService";
import { InstructorSigninUseCase } from "@application/useCases/instructor/Signin";
import { BusinessSigninUseCase } from "@application/useCases/business/Signin";
import { UserRefreshTokenUseCase } from "@application/useCases/shared/RefreshToken";
import { LearnerGoogleSigninUseCase } from "@application/useCases/learner/GoogleSignin";
import { GoogleAuthService } from "@infrastructure/services/GoogleAuthService";
import { InstructorGoogleSigninUseCase } from "@application/useCases/instructor/GoogleSignin";
import { BusinessGoogleSigninUseCase } from "@application/useCases/business/GoogleSignin";
import { VerifyEmailUseCase } from "@application/useCases/shared/VerifyEmail";
import { OTPVerificationUseCase } from "@application/useCases/shared/VerifyOTP";
import { ResetPasswordUseCase } from "@application/useCases/shared/ResetPassword";
import { adminRepository } from "../admin/adminController";




const userSignupUseCase=new UserSignupUseCase(learnerRepository,instructorRepository,businessRepository,cacheService,nodemailerService)

const learnerOTPVerificationUseCase=new LearnerOTPVerificationUseCase(cacheService,learnerRepository);

const instructorOTPVerificationUseCase=new InstructorOTPVerificationUseCase(cacheService,instructorRepository);

const businessOTPVerificationUseCase=new BusinessOTPVerificationUseCase(cacheService,businessRepository);

const resendOTPUseCase=new ResendOTPUseCase(cacheService,nodemailerService);

const learnerSigninUseCase=new LearnerSigninUseCase(learnerRepository,tokenService)

const instructorSigninUseCase=new InstructorSigninUseCase(instructorRepository,tokenService);

const businessSigninUseCase=new BusinessSigninUseCase(businessRepository,tokenService);

const userRefreshTokenUseCase=new UserRefreshTokenUseCase(tokenService,learnerRepository,instructorRepository,businessRepository,adminRepository);

const googleAuthService=new GoogleAuthService()

const learnerGoogleSigninUseCase=new LearnerGoogleSigninUseCase(learnerRepository,tokenService,googleAuthService);

const instructorGoogleSigninUseCase= new InstructorGoogleSigninUseCase(instructorRepository,tokenService,googleAuthService)

const businessGoogleSigninUseCase= new BusinessGoogleSigninUseCase(businessRepository,tokenService,googleAuthService);

const verifyEmailUseCase=new VerifyEmailUseCase(cacheService,nodemailerService,learnerRepository,instructorRepository,businessRepository);

const verifyOTPUseCase=new OTPVerificationUseCase(cacheService);

const resetPasswordUseCase= new ResetPasswordUseCase(learnerRepository,instructorRepository,businessRepository)

export const userAuthController=new UserAuthController(
    userSignupUseCase,
    learnerOTPVerificationUseCase,
    instructorOTPVerificationUseCase,
    businessOTPVerificationUseCase,
    resendOTPUseCase,
    learnerSigninUseCase,
    instructorSigninUseCase,
    businessSigninUseCase,
    userRefreshTokenUseCase,
    learnerGoogleSigninUseCase,instructorGoogleSigninUseCase,businessGoogleSigninUseCase,
    verifyEmailUseCase,
    verifyOTPUseCase,
    resetPasswordUseCase
);
