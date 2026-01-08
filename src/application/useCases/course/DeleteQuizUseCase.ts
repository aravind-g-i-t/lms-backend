import { IDeleteQuizUseCase } from "@application/IUseCases/course/IDeleteQuiz";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class DeleteQuizUseCase implements IDeleteQuizUseCase{
    constructor(
        private _quizRepository:IQuizRepository,
        private _courseRepository:ICourseRepository
    ){}

    async execute(input: { quizId: string,courseId:string }): Promise<void> {
        await this._quizRepository.deleteById(input.quizId);

        const quiz= await this._quizRepository.findById(input.quizId);
        if(quiz){
            throw new AppError("Failed to delete quiz.",STATUS_CODES.BAD_REQUEST)
        }
        await this._courseRepository.updateById(
            input.courseId,
            {
                quizId:null
            }
        );
    }
}