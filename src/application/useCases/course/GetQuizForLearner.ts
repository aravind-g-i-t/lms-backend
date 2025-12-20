import {  IGetQuizForLearnerUseCase } from "@application/IUseCases/course/IGetQuizForLearner";
import { Quiz } from "@domain/entities/Quiz";
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class GetQuizForLearnerUseCase implements IGetQuizForLearnerUseCase{
    constructor(
        private _learnerProgressRepository:ILearnerProgressRepository,
        private _quizRepository:IQuizRepository,
    ){}

    async execute(input: { courseId: string; learnerId: string; }): Promise<Quiz> {
        const {courseId,learnerId}= input;
        const progress= await this._learnerProgressRepository.findByLearnerAndCourse(learnerId,courseId);
        if(!progress){
            throw new AppError("Failed to access progress details.",STATUS_CODES.NOT_FOUND,false);
        }
        if(progress.progressPercentage!==100){
            throw new AppError("Finish all chapters to access the final quiz ",STATUS_CODES.NOT_FOUND);
        }
        
        const quiz= await this._quizRepository.findByCourse(courseId);
        if(!quiz){
            throw new AppError("Failed to access quiz.",STATUS_CODES.NOT_FOUND,false);
        }
        
        return quiz;
    }
}