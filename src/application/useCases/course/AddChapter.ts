import { AddChapterOutput } from "@application/dtos/course/AddChapter";
import { IAddChapterUseCase } from "@application/IUseCases/course/IAddChapter";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { IdGenerator } from "shared/utils/IdGenerator";

export class AddChapterUseCase implements IAddChapterUseCase {
    constructor(
        private _courseRepository: ICourseRepository,
        private _fileStorageService: IFileStorageService,
    ) { }

    async execute(courseId: string, moduleId: string, chapter: { title: string; description: string; video: string; duration: number; }): Promise<AddChapterOutput> {

        const newChapter = {
            id: IdGenerator.generate(),
            title: chapter.title,
            description: chapter.description,
            duration: chapter.duration,
            video: chapter.video,
            resources: []
        }
        const updated = await this._courseRepository.addChapter({
            courseId,
            moduleId,
            chapter: newChapter
        });

        if (!updated) {
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        const videoUrl = await this._fileStorageService.getViewURL(chapter.video);
        return { ...newChapter, video: videoUrl };

    }

};



