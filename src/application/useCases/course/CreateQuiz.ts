import { ICreateQuizUseCase } from "@application/IUseCases/course/ICreateQuiz";
import { Quiz } from "@domain/entities/Quiz";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class CreateQuizUseCase implements ICreateQuizUseCase{
    constructor(
        private _quizRepository:IQuizRepository,
        private _courseRepository:ICourseRepository
    ){}

    async execute(input: { courseId: string; }): Promise<Quiz> {
        const quiz= await this._quizRepository.create({courseId:input.courseId});
        if(!quiz){
            throw new AppError("Failed to create quiz",STATUS_CODES.BAD_REQUEST)
        }
        const courseUpdated= await this._courseRepository.updateById(input.courseId,{quizId:quiz.id});
        if(!courseUpdated){
            throw new AppError("Failed to update course",STATUS_CODES.BAD_REQUEST)
        }
        return quiz
    }
}