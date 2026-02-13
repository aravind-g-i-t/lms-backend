import { IDeleteQuizUseCase } from "@application/IUseCases/course/IDeleteQuiz";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
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
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        await this._courseRepository.updateById(
            input.courseId,
            {
                quizId:null
            }
        );
    }
}