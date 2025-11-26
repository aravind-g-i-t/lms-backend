import { IUpdateCourseStatusUseCase } from "@application/IUseCases/course/IUpdateStatus";
import { Course, CourseStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateCourseStatusUseCase implements IUpdateCourseStatusUseCase {
    constructor(
        private _courseRepositoty: ICourseRepository
    ) { }
    async execute(input: { courseId: string; status: string; }): Promise<void> {
        const { courseId, status } = input;
        const updates: Partial<Course> = {
            status: status as CourseStatus
        }
        if (status === "published") {
            updates.publishedAt = new Date()
        }
        const updated = await this._courseRepositoty.update({
            id: courseId,
            updates
        });

        if (!updated) {
            throw new AppError("Failed to update course status.", STATUS_CODES.BAD_REQUEST)
        }
    }
}