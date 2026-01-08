import { ISubmitCourseForReviewUseCase } from "@application/IUseCases/course/ISubmitForReview";
import { VerificationStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class SubmitCourseForReviewUseCase implements ISubmitCourseForReviewUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _instructorRepository: IInstructorRepository
    ) { }

    async execute(id: string): Promise<void> {
        const course = await this._courseRepository.findById(id);

        if (!course) {
            throw new AppError("Course not found.", STATUS_CODES.NOT_FOUND);
        }

        const instructor= await this._instructorRepository.findById(course.instructorId);
        if (!instructor) {
            throw new AppError("Instuctor not found", STATUS_CODES.NOT_FOUND);
        }
        if(instructor.verification.status!=="Verified"){
            throw new AppError("Instructor must be verified before submitting a course for review.",STATUS_CODES.FORBIDDEN)
        }

        if (!course.previewVideo || !course.thumbnail) {
            throw new AppError("Please fill all the required fields before submitting for review.",STATUS_CODES.BAD_REQUEST);
        }

        const totalChapters=course.modules.reduce((c,module)=>{
            c+=module.chapters.length;
            return c;
        },0);
        if(totalChapters<3){
            throw new AppError("A minimum of 3 chapters is required.")
        }

        // Ensure modules exist
        if (!course.modules || course.modules.length === 0) {
            throw new AppError("A course must contain at least one module before submitting for review.",STATUS_CODES.BAD_REQUEST);
        }

        // Ensure each module contains at least one chapter
        const hasEmptyModule = course.modules.some(m => !m.chapters || m.chapters.length === 0);

        if (hasEmptyModule) {
            throw new AppError("Each module must contain at least one chapter before submitting for review.",STATUS_CODES.BAD_REQUEST);
        }

        // Update verification status
        const statusUpdated = await this._courseRepository.updateById(
            id,
            {
                verification: {
                    submittedAt: new Date(),
                    reviewedAt: null,
                    status: VerificationStatus.UnderReview,
                    remarks: null
                }
            }
        );

        if (!statusUpdated) {
            throw new AppError("Failed to submit the course for review.", STATUS_CODES.BAD_REQUEST);
        }
    }
}
