import { IDeleteQuizQuestionUseCase } from "@application/IUseCases/course/IDeleteQuestion";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class DeleteQuizQuestionUseCase implements IDeleteQuizQuestionUseCase{
    constructor(
        private _quizRepo: IQuizRepository
    ){}
    async execute(input: { quizId: string; questionId:string}): Promise<void> {
        const updatedQuiz=await this._quizRepo.deleteQuestion(input.quizId,input.questionId);

        const notDeleted = updatedQuiz?.questions.find(q=>q.id===input.questionId);
        if(notDeleted){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}