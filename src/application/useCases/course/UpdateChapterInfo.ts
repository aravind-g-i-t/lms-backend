import { IUpdateChapterInfoUseCase } from "@application/IUseCases/course/IUpdateChapterInfo";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateChapterInfoUseCase implements IUpdateChapterInfoUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }
    async execute(input: { courseId: string; chapterId: string; moduleId: string; title: string; description: string; }): Promise<void> {
        const { courseId, moduleId, chapterId, title, description } = input;

        const updatedCourse = await this._courseRepository.updateChapterInfo({ courseId, moduleId, chapterId, updates: { title, description } })
        if (!updatedCourse) {
            throw new AppError("Failed to update chapter info — course or chapter not found",STATUS_CODES.BAD_REQUEST);
        }
    }
}