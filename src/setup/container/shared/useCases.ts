import { IssueCertificateUseCase } from "@application/useCases/certificate/IssueCertificate";
import {   conversationRepository, courseRepository, messageRepository, paymentRepository } from "./repositories";
import { cacheService, certificateTemplateService, googleAuthService, nodemailerService, pdfGeneratorService, presenceService, s3Service, stripeService, tokenService, zegoService } from "./services";
import { CreateCourseUseCase } from "@application/useCases/course/CreateCourse";
import { instructorEarningsRepository, instructorRepository, instructorWalletRepository, quizRepository } from "../instructor/repositories";
import { GetCourseDetailsUseCase } from "@application/useCases/course/GetCourseDetails";
import { UpdateCourseUseCase } from "@application/useCases/course/UpdateCourseInfo";
import { GetCoursesForInstructorUseCase } from "@application/useCases/course/GetCoursesForInstructor";
import { AddModuleUseCase } from "@application/useCases/course/AddModule";
import { AddChapterUseCase } from "@application/useCases/course/AddChapter";
import { UpdateChapterInfoUseCase } from "@application/useCases/course/UpdateChapterInfo";
import { UpdateChapterVideoUseCase } from "@application/useCases/course/UpdateChapterVideo";
import { UpdateModuleInfoUseCase } from "@application/useCases/course/UpdateModuleInfo";
import { DeleteChapterUseCase } from "@application/useCases/course/DeleteChapter";
import { DeleteModuleUseCase } from "@application/useCases/course/DeleteModule";
import { SubmitCourseForReviewUseCase } from "@application/useCases/course/SubmitForReview";
import { UpdateCourseVerificationUseCase } from "@application/useCases/course/UpdateVerification";
import { GetCoursesForAdminUseCase } from "@application/useCases/course/GetCoursesForAdmin";
import { UpdateCourseStatusUseCase } from "@application/useCases/course/UpdateStatus";
import { GetCoursesForLearnerUseCase } from "@application/useCases/course/GetCoursesForLearner";
import { GetCourseDetailsForLearnerUseCase } from "@application/useCases/course/GetCourseDetailsForLearner";
import { GetFullCourseForLearnerUseCase } from "@application/useCases/course/GetFullCourseForLearner";
import { GetCourseDetailsForCheckoutUseCase } from "@application/useCases/course/GetCourseForCheckout";
import { AddResourceUseCase } from "@application/useCases/course/AddResource";
import { DeleteResourceUseCase } from "@application/useCases/course/DeleteResource";
import { GetFavouritesUseCase } from "@application/useCases/favourite/GetFavourites";
import { GetVideoUseCase } from "@application/useCases/course/GetVideo";
import { GetCoursesOptionsUseCase } from "@application/useCases/course/GetCourseOptions";
import { enrollmentRepository, favouriteRepository, learnerProgressRepository, learnerRepository, walletRepository } from "../learner/repostitories";


import { GetUploadUrlUseCase } from "@application/useCases/shared/GetUploadUrl";
import { GetDownloadUrlUseCase } from "@application/useCases/shared/GetDownloadUrl";
import { UserSignupUseCase } from "@application/useCases/shared/Signup";
import { businessRepository } from "../business/repositories";
import { LearnerOTPVerificationUseCase } from "@application/useCases/learner/OTPVerification";
import { InstructorOTPVerificationUseCase } from "@application/useCases/instructor/OTPVerification";
import { BusinessOTPVerificationUseCase } from "@application/useCases/business/OTPVerification";
import { ResendOTPUseCase } from "@application/useCases/shared/ResendOTP";
import { InstructorSigninUseCase } from "@application/useCases/instructor/Signin";
import { LearnerSigninUseCase } from "@application/useCases/learner/Signin";
import { BusinessSigninUseCase } from "@application/useCases/business/Signin";
import { UserRefreshTokenUseCase } from "@application/useCases/shared/RefreshToken";
import { adminRepository, certificateRepository, couponRepository } from "../admin/repositories";
import { LearnerGoogleSigninUseCase } from "@application/useCases/learner/GoogleSignin";
import { InstructorGoogleSigninUseCase } from "@application/useCases/instructor/GoogleSignin";
import { BusinessGoogleSigninUseCase } from "@application/useCases/business/GoogleSignin";
import { VerifyEmailUseCase } from "@application/useCases/shared/VerifyEmail";
import { OTPVerificationUseCase } from "@application/useCases/shared/VerifyOTP";
import { ResetPasswordUseCase } from "@application/useCases/shared/ResetPassword";
import { getValidCouponsUseCase } from "../admin/useCases";
import { SendMessageUseCase } from "@application/useCases/message/SendMessage";
import { MarkMessagesReadUseCase } from "@application/useCases/message/MarkMessagesReadUseCase";
import { GetLearnerConversationsUseCase } from "@application/useCases/message/GetLearnerConversations";
import { GetMessagesUseCase } from "@application/useCases/message/GetMessages";
import { GetInstructorConversationUseCase } from "@application/useCases/message/GetInstructorConversations";
import { DeleteMessagesForMeUseCase } from "@application/useCases/message/DeleteForMe";
import { DeleteMessagesForEveryoneUseCase } from "@application/useCases/message/DeleteForEveryone";
import { GetUnreadMessagesCountUseCase } from "@application/useCases/message/GetUnreadCount";
import { CreatePaymentUseCase } from "@application/useCases/payment/CreatePayment";
import { VerifyPaymentUseCase } from "@application/useCases/payment/VerifyPayment";
import { GetVideoCallTokenUseCase } from "@application/useCases/videoCall/GetVideoCallToken";
import { GetCourseAnalyticsUseCaseImpl } from "@application/useCases/course/GetCourseAnalytics";

export const userSignupUseCase=new UserSignupUseCase(learnerRepository,instructorRepository,businessRepository,cacheService,nodemailerService)

export const learnerOTPVerificationUseCase=new LearnerOTPVerificationUseCase(cacheService,learnerRepository,walletRepository);

export const instructorOTPVerificationUseCase=new InstructorOTPVerificationUseCase(cacheService,instructorRepository,instructorWalletRepository);

export const businessOTPVerificationUseCase=new BusinessOTPVerificationUseCase(cacheService,businessRepository);

export const resendOTPUseCase=new ResendOTPUseCase(cacheService,nodemailerService);

export const learnerSigninUseCase=new LearnerSigninUseCase(learnerRepository,tokenService,s3Service)

export const instructorSigninUseCase=new InstructorSigninUseCase(instructorRepository,tokenService,s3Service);

export const businessSigninUseCase=new BusinessSigninUseCase(businessRepository,tokenService,s3Service);

export const userRefreshTokenUseCase=new UserRefreshTokenUseCase(tokenService,learnerRepository,instructorRepository,businessRepository,adminRepository);


export const learnerGoogleSigninUseCase=new LearnerGoogleSigninUseCase(learnerRepository,tokenService,googleAuthService,walletRepository);

export const instructorGoogleSigninUseCase= new InstructorGoogleSigninUseCase(instructorRepository,tokenService,googleAuthService,instructorWalletRepository)

export const businessGoogleSigninUseCase= new BusinessGoogleSigninUseCase(businessRepository,tokenService,googleAuthService);

export const verifyEmailUseCase=new VerifyEmailUseCase(cacheService,nodemailerService,learnerRepository,instructorRepository,businessRepository);

export const verifyOTPUseCase=new OTPVerificationUseCase(cacheService);

export const resetPasswordUseCase= new ResetPasswordUseCase(learnerRepository,instructorRepository,businessRepository)

export const issueCertificateUseCase=new IssueCertificateUseCase(certificateRepository,certificateTemplateService,pdfGeneratorService,s3Service);

export const createCourseUseCase=new CreateCourseUseCase(courseRepository,instructorRepository)

export const getCourseDetailsUseCase= new GetCourseDetailsUseCase(courseRepository,s3Service,quizRepository)

export const updateCourseUseCase= new UpdateCourseUseCase(courseRepository)

export const getCoursesForInstructorUseCase= new GetCoursesForInstructorUseCase(courseRepository,s3Service)

export const addModuleUseCase=new AddModuleUseCase(courseRepository)

export const addChapterUseCase = new AddChapterUseCase(courseRepository,s3Service);

export const updateChapterUseCase=  new UpdateChapterInfoUseCase(courseRepository);

export const updateVideoUseCase= new UpdateChapterVideoUseCase(courseRepository);

export const updateModuleUseCase = new UpdateModuleInfoUseCase(courseRepository);

export const deleteChapterUseCase = new DeleteChapterUseCase(courseRepository);

export const deleteModuleUseCase = new DeleteModuleUseCase(courseRepository);

export const submitCourseForReviewUseCase = new SubmitCourseForReviewUseCase(courseRepository,instructorRepository);

export const updateCourseVerificationUseCase = new UpdateCourseVerificationUseCase(courseRepository);

export const getCoursesForAdminUseCase= new GetCoursesForAdminUseCase(courseRepository,s3Service);

export const updateCourseStatusUseCase = new UpdateCourseStatusUseCase(courseRepository)

export const getCoursesForLearnerUseCase = new GetCoursesForLearnerUseCase(courseRepository,s3Service,favouriteRepository);

export const getCourseDetailsForLearner = new GetCourseDetailsForLearnerUseCase(courseRepository,s3Service,enrollmentRepository,favouriteRepository,learnerProgressRepository)

export const getFullCourseForLearnerUseCase = new GetFullCourseForLearnerUseCase(courseRepository,s3Service,learnerProgressRepository)


export const getCourseDetailsForCheckout= new GetCourseDetailsForCheckoutUseCase(courseRepository,s3Service,getValidCouponsUseCase);

export const addResourceUseCase = new AddResourceUseCase(courseRepository,s3Service)

export const deleteResourceUseCase= new DeleteResourceUseCase(courseRepository);

export const getFavouritesUseCase = new GetFavouritesUseCase(courseRepository,s3Service,favouriteRepository)

export  const getVideoUseCase= new GetVideoUseCase(enrollmentRepository,courseRepository);

export  const getCourseOptionsUseCase= new GetCoursesOptionsUseCase(courseRepository)







export const getUploadUrlUseCase= new GetUploadUrlUseCase(s3Service);

export const getDownloadUrlUseCase=new GetDownloadUrlUseCase(s3Service);

export const sendMessageUseCase= new SendMessageUseCase(conversationRepository,messageRepository,s3Service);

export const markMessagesReadUseCase= new MarkMessagesReadUseCase(messageRepository,conversationRepository);

export const getConversationsUseCase= new GetLearnerConversationsUseCase(conversationRepository,messageRepository,courseRepository,instructorRepository,learnerRepository,s3Service,presenceService);

export const getMessagesUseCase= new GetMessagesUseCase(messageRepository,s3Service);

export const getInstructorConversations= new GetInstructorConversationUseCase(conversationRepository,messageRepository,courseRepository,instructorRepository,learnerRepository,s3Service,presenceService);

export const deleteForMeUseCase= new DeleteMessagesForMeUseCase(messageRepository);

export const deleteForEveryoneUseCase= new DeleteMessagesForEveryoneUseCase(messageRepository,s3Service)

export const getUnreadMessagesCountUseCase= new GetUnreadMessagesCountUseCase(conversationRepository);

export const createPaymentUseCase = new CreatePaymentUseCase(paymentRepository);

export const verifyPaymentUseCase = new VerifyPaymentUseCase(
    paymentRepository,
    enrollmentRepository,
    stripeService,
    instructorWalletRepository,
    instructorEarningsRepository,
    learnerProgressRepository,
    courseRepository,
    couponRepository
);

export const getVideoCallTokenUseCase= new GetVideoCallTokenUseCase(zegoService)

export const getCourseAnalyticsUseCase= new GetCourseAnalyticsUseCaseImpl(enrollmentRepository,learnerProgressRepository);

