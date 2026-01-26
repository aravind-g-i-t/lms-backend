import { CourseController } from "@presentation/http/controllers/CourseController";
import {  addChapterUseCase, addModuleUseCase, addResourceUseCase, businessGoogleSigninUseCase, businessOTPVerificationUseCase, businessSigninUseCase, createCourseUseCase, deleteChapterUseCase, deleteForEveryoneUseCase, deleteForMeUseCase, deleteModuleUseCase, deleteResourceUseCase, getConversationsUseCase, getCourseDetailsForCheckout, getCourseDetailsForLearner, getCourseDetailsUseCase, getCourseOptionsUseCase, getCoursesForAdminUseCase, getCoursesForInstructorUseCase, getCoursesForLearnerUseCase, getDownloadUrlUseCase, getFavouritesUseCase, getFullCourseForLearnerUseCase,  getInstructorConversations,  getMessagesUseCase,  getUploadUrlUseCase, getVideoCallTokenUseCase, getVideoUseCase, instructorGoogleSigninUseCase, instructorOTPVerificationUseCase, instructorSigninUseCase, learnerGoogleSigninUseCase, learnerOTPVerificationUseCase, learnerSigninUseCase, resendOTPUseCase, resetPasswordUseCase, submitCourseForReviewUseCase, updateChapterUseCase, updateCourseStatusUseCase, updateCourseUseCase, updateCourseVerificationUseCase, updateModuleUseCase, updateVideoUseCase, userRefreshTokenUseCase, userSignupUseCase, verifyEmailUseCase, verifyOTPUseCase, verifyPaymentUseCase } from "./useCases";
import { s3Service } from "./services";
import { S3Controller } from "@presentation/http/controllers/S3Controller";
import { UserAuthController } from "@presentation/http/controllers/UserAuthController";
import { MessageController } from "@presentation/http/controllers/MessageController";
import { PaymentController } from "@presentation/http/controllers/PaymentController";


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
    learnerGoogleSigninUseCase,
    instructorGoogleSigninUseCase,
    businessGoogleSigninUseCase,
    verifyEmailUseCase,
    verifyOTPUseCase,
    resetPasswordUseCase
);

export const courseController=new CourseController(
    createCourseUseCase,
    getCoursesForInstructorUseCase,
    getCourseDetailsUseCase,
    updateCourseUseCase,
    addModuleUseCase,
    addChapterUseCase,
    updateChapterUseCase,
    updateVideoUseCase,
    updateModuleUseCase,
    deleteModuleUseCase,
    deleteChapterUseCase,
    submitCourseForReviewUseCase,
    updateCourseVerificationUseCase,
    getCoursesForAdminUseCase,
    updateCourseStatusUseCase,
    getCoursesForLearnerUseCase,
    getCourseDetailsForLearner,
    getFullCourseForLearnerUseCase,
    getCourseDetailsForCheckout,
    addResourceUseCase,
    deleteResourceUseCase,
    getFavouritesUseCase,
    getVideoUseCase,
    s3Service,
    getCourseOptionsUseCase
);


export const messageController= new MessageController(
    getConversationsUseCase,
    getMessagesUseCase,
    getInstructorConversations,
    getVideoCallTokenUseCase,
    deleteForMeUseCase,
    deleteForEveryoneUseCase
)


export const s3Controller=new S3Controller(getUploadUrlUseCase,getDownloadUrlUseCase);

export const paymentController = new PaymentController(verifyPaymentUseCase);