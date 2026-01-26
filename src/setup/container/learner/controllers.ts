import { LearnerController } from "@presentation/http/controllers/LearnerController";
import { addToFavouritesUseCase, createReviewUseCase, getEnrollmentsUseCase, getLeanerDataUseCase, getLearnersUseCase, getReviewsForLearnerUseCase, initiateEnrollmentUseCase, markChapterAsCompletedUseCase, removeFromFavouritesUseCase, updateCurrentChapterUseCase, updateLearnerDataUseCase, updateLearnerPasswordUseCase, updateLearnerStatusUseCase } from "./useCases";
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
    removeFromFavouritesUseCase
);

export const enrollmentController = new EnrollmentController(
    initiateEnrollmentUseCase,
    getEnrollmentsUseCase
);

export const progressController= new ProgressController(
    markChapterAsCompletedUseCase,
    updateCurrentChapterUseCase
);

export const reviewController= new ReviewController(
    createReviewUseCase,
    getReviewsForLearnerUseCase
)