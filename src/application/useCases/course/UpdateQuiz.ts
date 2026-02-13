import { IUpdateQuizUseCase } from "@application/IUseCases/course/IUpdateQuiz";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateQuizUseCase implements IUpdateQuizUseCase{
    constructor(
        private _quizRepo:IQuizRepository
    ){}

    async execute(input: {quizId:string, passingScore: number; timeLimitMinutes: number|null; }): Promise<void> {
        const {passingScore,timeLimitMinutes,quizId}= input;
        const updated= await this._quizRepo.updateById(quizId,{passingScore,timeLimitMinutes});
        if(!updated){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    }
}