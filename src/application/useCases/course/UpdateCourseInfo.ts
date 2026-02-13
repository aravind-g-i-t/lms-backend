import { IUpdateCourseUseCase } from "@application/IUseCases/course/IUpdateCourse";
import { Course } from "@domain/entities/Course";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateCourseUseCase implements IUpdateCourseUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }

    async execute(id: string, updates: Partial<Course>): Promise<void> {

        const updated = await this._courseRepository.updateById(
            id,
            updates
        );
        if (!updated) {
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}