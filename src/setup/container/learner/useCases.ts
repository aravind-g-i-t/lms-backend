import { GetLearnersUseCase } from "@application/useCases/learner/GetLearners";
import { enrollmentRepository, favouriteRepository, learnerProgressRepository, learnerRepository, reviewRepository } from "./repostitories";
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
import { courseRepository } from "../shared/repositories";
import { instructorRepository, liveSessionRepository } from "../instructor/repositories";
import { couponRepository } from "../admin/repositories";
import { createPaymentUseCase } from "../shared/useCases";
import { MarkChapterAsCompletedUseCase } from "@application/useCases/learnerProgress/MarkChapterAsCompleted";
import { UpdateCurrentChapterUseCase } from "@application/useCases/course/UpdateCurrentChapter";
import { GetSessionListForLearnerUseCase } from "@application/useCases/liveSession/GetSessionListForLearner";
import { CreateReviewUseCase } from "@application/useCases/review/CreateReview";
import { GetReviewsForLearnerUseCase } from "@application/useCases/review/GetReviewsForLearner";

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
    couponRepository
);

export const getEnrollmentsUseCase = new GetEnrollmentsUseCase(enrollmentRepository,learnerProgressRepository,s3Service);

export const markChapterAsCompletedUseCase= new MarkChapterAsCompletedUseCase(learnerProgressRepository);

export const updateCurrentChapterUseCase= new UpdateCurrentChapterUseCase(learnerProgressRepository)

export const getLiveSessionsForLearner= new GetSessionListForLearnerUseCase(liveSessionRepository);

export const createReviewUseCase= new CreateReviewUseCase(reviewRepository,enrollmentRepository,courseRepository);

export const getReviewsForLearnerUseCase= new GetReviewsForLearnerUseCase(reviewRepository,s3Service)