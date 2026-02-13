import { IUpdateCourseStatusUseCase } from "@application/IUseCases/course/IUpdateStatus";
import { Course, CourseStatus } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
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
        const updated = await this._courseRepositoty.updateById(courseId,updates);

        if (!updated) {
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}