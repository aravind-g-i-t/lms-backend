import { ISubmitCourseForReviewUseCase } from "@application/IUseCases/course/ISubmitForReview";
import { VerificationStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class SubmitCourseForReviewUseCase implements ISubmitCourseForReviewUseCase{
    constructor(
        private _courseRepository:ICourseRepository
    ){}

    async execute(id: string): Promise<void> {
        const course= await this._courseRepository.findById(id);

        if(!course){
            throw new AppError("Course not found.",STATUS_CODES.BAD_REQUEST)
        }
        if(!course.previewVideo || !course.thumbnail){
            throw new AppError("Please fill all the required fields before submitting for review.")
        }
        const statusUpdated= await this._courseRepository.update({
            id,
            updates:{
                verification:{
                    submittedAt:new Date(),
                    reviewedAt:null,
                    status:VerificationStatus.UnderReview,
                    remarks:null
                },
            }
        });
        if(!statusUpdated){
            throw new AppError("Failed to submit the course for review",STATUS_CODES.BAD_REQUEST)
        }
    }
}