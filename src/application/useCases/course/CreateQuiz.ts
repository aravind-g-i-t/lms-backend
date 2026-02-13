import { ICreateQuizUseCase } from "@application/IUseCases/course/ICreateQuiz";
import { Quiz } from "@domain/entities/Quiz";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class CreateQuizUseCase implements ICreateQuizUseCase{
    constructor(
        private _quizRepository:IQuizRepository,
        private _courseRepository:ICourseRepository
    ){}

    async execute(input: { courseId: string; }): Promise<Quiz> {
        const quiz= await this._quizRepository.create({courseId:input.courseId});
        if(!quiz){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        const courseUpdated= await this._courseRepository.updateById(input.courseId,{quizId:quiz.id});
        if(!courseUpdated){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        return quiz
    }
}