import { ICreateReviewUseCase } from "@application/IUseCases/review/ICreateReview";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { Review } from "@domain/entities/Review";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IReviewRepository } from "@domain/interfaces/IReviewRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class CreateReviewUseCase implements ICreateReviewUseCase{
    constructor(
        private _reviewRepository:IReviewRepository,
        private _enrollmentRepository:IEnrollmentRepository,
        private _courseRepository:ICourseRepository,
        
    ){}

    async execute(input:{learnerId:string; courseId:string; rating:1|2|3|4|5; reviewText:string|null}):Promise<Review>{
        const {learnerId,courseId,rating,reviewText}=input
        const isEnrolled= await this._enrollmentRepository.findOne({
            learnerId,
            courseId,
            status:EnrollmentStatus.Active
        });
        if(!isEnrolled){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }

        const existingReview = await this._reviewRepository.findOne({
            learnerId,
            courseId,
        });

        if (existingReview) {
            throw new AppError(
                "You have already reviewed this course",
                STATUS_CODES.BAD_REQUEST
            );
        }

        const course= await this._courseRepository.findById(courseId);
        if(!course){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }

        const review= await this._reviewRepository.create({
            learnerId,
            courseId,
            reviewText,
            rating,
            isVisible:true,
            isEdited:false
        });
        if(!review){
            throw new AppError(MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
        }
        
        const totalRatings=course.totalRatings+1;
        const ratingSum= await this._reviewRepository.getRatingSum(courseId);
        const newRating= ratingSum/totalRatings;
        const ratingDistribution= course.ratingDistribution;
        ratingDistribution[rating]++;
        
        const courseUpdated= await this._courseRepository.updateById(
            courseId,
            {
                totalRatings,
                rating:newRating,
                ratingDistribution
            }
        )
        if(!courseUpdated){
            throw new AppError("Failed to update rating",STATUS_CODES.BAD_REQUEST)
        }
        return review;
    }
}