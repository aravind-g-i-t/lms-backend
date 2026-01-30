import { IUpdateReviewUseCase } from "@application/IUseCases/review/IUpdateReview";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { Review } from "@domain/entities/Review";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IReviewRepository } from "@domain/interfaces/IReviewRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateReviewUseCase implements IUpdateReviewUseCase {
  constructor(
    private _reviewRepository: IReviewRepository,
    private _enrollmentRepository: IEnrollmentRepository,
    private _courseRepository: ICourseRepository
  ) {}

  async execute(input: {
    learnerId: string;
    courseId: string;
    rating: 1 | 2 | 3 | 4 | 5;
    reviewText: string | null;
  }): Promise<Review> {
    const { learnerId, courseId, rating, reviewText } = input;
    console.log(input);
    
    const isEnrolled = await this._enrollmentRepository.findOne({
      learnerId,
      courseId,
      status: EnrollmentStatus.Active,
    });

    if (!isEnrolled) {
      throw new AppError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    }

    const existingReview = await this._reviewRepository.findOne({
      learnerId,
      courseId,
    });

    if (!existingReview) {
      throw new AppError(
        "Review not found",
        STATUS_CODES.NOT_FOUND
      );
    }

    const course = await this._courseRepository.findById(courseId);
    if (!course) {
      throw new AppError(MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    const oldRating = existingReview.rating;

    const updatedReview = await this._reviewRepository.updateById(
      existingReview.id,
      {
        rating,
        reviewText,
        isEdited: true,
      }
    );

    if (!updatedReview) {
      throw new AppError(
        "Failed to update review",
        STATUS_CODES.BAD_REQUEST
      );
    }

    // update rating distribution
    const ratingDistribution = { ...course.ratingDistribution };
    ratingDistribution[oldRating as 1|2|3|4|5]--;
    ratingDistribution[rating]++;

    const ratingSum = await this._reviewRepository.getRatingSum(courseId);
    const newRating = ratingSum / course.totalRatings;

    const courseUpdated = await this._courseRepository.updateById(courseId, {
      rating: newRating,
      ratingDistribution,
    });

    if (!courseUpdated) {
      throw new AppError(
        "Failed to update course rating",
        STATUS_CODES.BAD_REQUEST
      );
    }

    return updatedReview;
  }
}
