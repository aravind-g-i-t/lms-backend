import { IUpdateCurrentChapterUseCase } from "@application/IUseCases/course/IUpdateCurrentChapter";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateCurrentChapterUseCase implements IUpdateCurrentChapterUseCase{
    constructor(
        private _progressRepository:ILearnerProgressRepository
    ){}

    async execute(input:{learnerId:string; courseId:string;chapterId:string}):Promise<void>{
        const updated= await this._progressRepository.findOneAndUpdate({courseId:input.courseId,learnerId:input.learnerId},{currentChapterId:input.chapterId,lastAccessedAt:new Date()});

        if(!updated){
            throw new AppError("Failed to update progress",STATUS_CODES.BAD_REQUEST)
        }
    }
}