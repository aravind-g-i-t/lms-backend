import { IUpdateCourseVerificationUseCase } from "@application/IUseCases/course/IUpdateVerification";
import { Course, VerificationStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateCourseVerificationUseCase implements IUpdateCourseVerificationUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }

    async execute(input: { courseId: string; status: string; remarks: string | null }): Promise<Course["verification"]> {
        const { courseId, status, remarks } = input;


        const course = await this._courseRepository.findById(courseId);
        if (!course) {
            throw new AppError("Course not found", STATUS_CODES.BAD_REQUEST)
        }

        const updatedVerification = {
            ...course.verification,
            status: status as VerificationStatus,
            remarks: remarks ?? null,
            reviewedAt: new Date(),
        };

        // Update course verification
        const updatedCourse = await this._courseRepository.updateById(
            courseId,
            {
                verification: updatedVerification
            }
        );

        if (!updatedCourse) {
            throw new AppError("Failed to update verification status", STATUS_CODES.BAD_REQUEST);
        }

        return updatedCourse.verification
    }
}