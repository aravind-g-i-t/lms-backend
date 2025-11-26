import { IUpdateChapterVideoUseCase } from "@application/IUseCases/course/IUpdateChapterVideo";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateChapterVideoUseCase implements IUpdateChapterVideoUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }
    async execute(input: { courseId: string; chapterId: string; moduleId: string; video: string; duration: number }): Promise<void> {
        const { courseId, moduleId, chapterId, video, duration } = input;

        const updatedCourse = await this._courseRepository.updateChapterVideo({
            courseId,
            moduleId,
            chapterId,
            video,
            duration,
        });

        if (!updatedCourse) {
            throw new AppError("Failed to update chapter video — course or chapter not found", STATUS_CODES.BAD_REQUEST);
        }
    }
}