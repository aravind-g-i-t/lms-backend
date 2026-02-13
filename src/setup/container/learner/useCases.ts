import { GetLearnersUseCase } from "@application/useCases/learner/GetLearners";
import { enrollmentRepository, favouriteRepository, learnerProgressRepository, learnerRepository, reviewRepository, walletRepository, walletTransactionRepository } from "./repostitories";
import { s3Service, stripeService } from "../shared/services";
import { UpdateLearnerStatusUseCase } from "@application/useCases/learner/UpdateLearnerStatus";
import { UpdateLearnerDataUseCase } from "@application/useCases/learner/UpdateLearnerData";
import { UpdateLearnerPasswordUseCase } from "@application/useCases/learner/UpdatePassword";
import { GetLearnerDataUseCase } from "@application/useCases/learner/GetLearnerData";
import { AddToFavouritesUseCase } from "@application/useCases/favourite/AddToFavourites";
import { RemoveFromFavouritesUseCase } from "@application/useCases/favourite/RemoveFromFavourites";
import { CreateEnrollmentUseCase } from "@application/useCases/enrollment/CreateEnrollment";
import { InitiateEnrollmentUseCase } from "@application/useCases/enrollment/InitiateEnrollment";
import { GetEnrollmentsUseCase } from "@application/useCases/enrollment/GetEnrollments";
import { courseRepository, paymentRepository } from "../shared/repositories";
import { instructorEarningsRepository, instructorRepository, instructorWalletRepository, liveSessionRepository } from "../instructor/repositories";
import { categoryRepository, couponRepository } from "../admin/repositories";
import { createPaymentUseCase, getCoursesForLearnerUseCase } from "../shared/useCases";
import { MarkChapterAsCompletedUseCase } from "@application/useCases/learnerProgress/MarkChapterAsCompleted";
import { UpdateCurrentChapterUseCase } from "@application/useCases/course/UpdateCurrentChapter";
import { GetSessionListForLearnerUseCase } from "@application/useCases/liveSession/GetSessionListForLearner";
import { CreateReviewUseCase } from "@application/useCases/review/CreateReview";
import { GetReviewsForLearnerUseCase } from "@application/useCases/review/GetReviewsForLearner";
import { GetHomePageData } from "@application/useCases/learner/GetHomePageData";
import { GetCourseCategoriesSummaryUseCase } from "@application/useCases/category/GetCategorySummary";
import { GetLearnerHomeDataUseCase } from "@application/useCases/learner/GetLearnerHomeData";
import { GetRecommendedCoursesForLearnerUseCase } from "@application/useCases/course/GetRecommended";
import { GetPopularCoursesUseCase } from "@application/useCases/course/GetPopularCourses";
import { UpdateReviewUseCase } from "@application/useCases/review/UpdateReview";
import { GetLearnerEnrollmentsUseCase } from "@application/useCases/enrollment/GetLearnerEnrollmentsForInstructor";
import { CancelEnrollmentUseCase } from "@application/useCases/enrollment/CancelEnrollment";
import { GetWalletDataUseCase } from "@application/useCases/wallet/GetWalletData";

export const getLearnersUseCase=new GetLearnersUseCase(learnerRepository,s3Service)

export const updateLearnerStatusUseCase=new UpdateLearnerStatusUseCase(learnerRepository)

export const updateLearnerDataUseCase=new UpdateLearnerDataUseCase(learnerRepository);

export const updateLearnerPasswordUseCase=new UpdateLearnerPasswordUseCase(learnerRepository)

export const getLeanerDataUseCase=new GetLearnerDataUseCase(learnerRepository,s3Service);

export const addToFavouritesUseCase= new AddToFavouritesUseCase(favouriteRepository)

export const removeFromFavouritesUseCase= new RemoveFromFavouritesUseCase(favouriteRepository)

export const createEnrollmentUseCase = new CreateEnrollmentUseCase(enrollmentRepository);


export const initiateEnrollmentUseCase = new InitiateEnrollmentUseCase(
    courseRepository,
    createPaymentUseCase,
    createEnrollmentUseCase,
    stripeService,
    instructorRepository,
    couponRepository,
    learnerRepository,
    enrollmentRepository
);

export const getEnrollmentsUseCase = new GetEnrollmentsUseCase(enrollmentRepository,learnerProgressRepository,s3Service);

export const markChapterAsCompletedUseCase= new MarkChapterAsCompletedUseCase(learnerProgressRepository);

export const updateCurrentChapterUseCase= new UpdateCurrentChapterUseCase(learnerProgressRepository)

export const getLiveSessionsForLearner= new GetSessionListForLearnerUseCase(liveSessionRepository);

export const createReviewUseCase= new CreateReviewUseCase(reviewRepository,enrollmentRepository,courseRepository);

export const getReviewsForLearnerUseCase= new GetReviewsForLearnerUseCase(reviewRepository,s3Service)

export const getCategorySummaryUseCase= new GetCourseCategoriesSummaryUseCase(courseRepository,categoryRepository)

export const getRecommendedCoursesUseCase= new GetRecommendedCoursesForLearnerUseCase(enrollmentRepository,courseRepository,s3Service)

export const getHomePageDataUseCase= new GetHomePageData(getCategorySummaryUseCase)

export const getLearnerHomeDataUseCase= new GetLearnerHomeDataUseCase(getEnrollmentsUseCase,getRecommendedCoursesUseCase);

export const getPopularCoursesUseCase= new GetPopularCoursesUseCase(getCoursesForLearnerUseCase)

export const updateReviewUseCase= new UpdateReviewUseCase(reviewRepository,enrollmentRepository,courseRepository)

export const getLearnerEnrollmentsForInstructorUseCase= new GetLearnerEnrollmentsUseCase(enrollmentRepository,s3Service);

export const cancelEnrollmentUseCase= new CancelEnrollmentUseCase(enrollmentRepository,paymentRepository,instructorEarningsRepository,walletRepository,instructorWalletRepository,walletTransactionRepository,courseRepository)

export const getWalletDataUseCase= new GetWalletDataUseCase(walletRepository,walletTransactionRepository)