import { IDeleteChaperUseCase } from "@application/IUseCases/course/IDeleteChapter";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class DeleteChapterUseCase implements IDeleteChaperUseCase {
    constructor(
        private _courseRepository: ICourseRepository
    ) { }

    async execute(input: { courseId: string; moduleId: string; chapterId: string; }): Promise<void> {
        const { courseId, moduleId, chapterId } = input;
        const deleted = await this._courseRepository.removeChapter({ courseId, moduleId, chapterId });
        if (!deleted) {
            throw new AppError("Failed to delete chapter.", STATUS_CODES.BAD_REQUEST)
        }
    }
}