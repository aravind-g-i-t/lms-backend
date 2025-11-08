import { IUpdateCourseVerificationUseCase } from "@application/IUseCases/course/IUpdateVerification";
import { Course, VerificationStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateCourseVerificationUseCase implements IUpdateCourseVerificationUseCase{
    constructor(
        private _courseRepository:ICourseRepository
    ){}

    async execute(input: { courseId: string; status: string; remarks: string | null; submittedAt:Date; }): Promise<Course["verification"]> {
        const {courseId,status,remarks,submittedAt}=input;
        
        const verification:Course["verification"]={
                submittedAt:submittedAt,
                reviewedAt:new Date(),
                status:status as VerificationStatus,
                remarks:remarks
        }

        const updated = await this._courseRepository.update({
            id:courseId,
            updates:{
                verification
            }
        });
        if(!updated){
            throw new AppError("Failed to update course verificaton status.",STATUS_CODES.BAD_REQUEST)
        }

        return updated.verification;
    }
}