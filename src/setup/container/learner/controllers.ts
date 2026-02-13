import { LearnerController } from "@presentation/http/controllers/LearnerController";
import { addToFavouritesUseCase, cancelEnrollmentUseCase, createReviewUseCase, getEnrollmentsUseCase, getHomePageDataUseCase, getLeanerDataUseCase, getLearnerEnrollmentsForInstructorUseCase, getLearnerHomeDataUseCase, getLearnersUseCase, getReviewsForLearnerUseCase, getWalletDataUseCase, initiateEnrollmentUseCase, markChapterAsCompletedUseCase, removeFromFavouritesUseCase, updateCurrentChapterUseCase, updateLearnerDataUseCase, updateLearnerPasswordUseCase, updateLearnerStatusUseCase, updateReviewUseCase } from "./useCases";
import { EnrollmentController } from "@presentation/http/controllers/EnrollmentController";
import { ProgressController } from "@presentation/http/controllers/ProgressController";
import { ReviewController } from "@presentation/http/controllers/ReviewController";

export const learnerController= new LearnerController(
    getLearnersUseCase,
    updateLearnerStatusUseCase,
    updateLearnerDataUseCase,
    updateLearnerPasswordUseCase,
    getLeanerDataUseCase,
    addToFavouritesUseCase,
    removeFromFavouritesUseCase,
    getLearnerHomeDataUseCase,
    getHomePageDataUseCase,
    getWalletDataUseCase
);

export const enrollmentController = new EnrollmentController(
    initiateEnrollmentUseCase,
    getEnrollmentsUseCase,
    getLearnerEnrollmentsForInstructorUseCase,
    cancelEnrollmentUseCase
);

export const progressController= new ProgressController(
    markChapterAsCompletedUseCase,
    updateCurrentChapterUseCase
);

export const reviewController= new ReviewController(
    createReviewUseCase,
    getReviewsForLearnerUseCase,
    updateReviewUseCase,
    
)