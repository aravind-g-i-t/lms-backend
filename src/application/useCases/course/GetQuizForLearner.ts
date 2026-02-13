import {  IGetQuizForLearnerUseCase } from "@application/IUseCases/course/IGetQuizForLearner";
import { Quiz } from "@domain/entities/Quiz";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetQuizForLearnerUseCase implements IGetQuizForLearnerUseCase{
    constructor(
        private _learnerProgressRepository:ILearnerProgressRepository,
        private _quizRepository:IQuizRepository,
    ){}

    async execute(input: { courseId: string; learnerId: string; }): Promise<Quiz> {
        const {courseId,learnerId}= input;
        const progress= await this._learnerProgressRepository.findOne({learnerId,courseId});
        if(!progress){
            throw new AppError(MESSAGES.PROGRESS_NOT_FOUND,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
        if(progress.progressPercentage!==100){
            throw new AppError(MESSAGES.QUIZ_NOT_ACCESSIBLE,STATUS_CODES.BAD_REQUEST);
        }
        
        const quiz= await this._quizRepository.findOne({courseId});
        if(!quiz){
            throw new AppError(MESSAGES.QUIZ_NOT_FOUND,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
        
        return quiz;
    }
}