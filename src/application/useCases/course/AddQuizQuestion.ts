import { AddQuizQuestionInput } from "@application/dtos/course/AddQuizQuestions";
import { IAddQuizQuestionUseCase } from "@application/IUseCases/course/IAddQuizQuestion";
import { QuizQuestion } from "@domain/entities/Quiz";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { IdGenerator } from "shared/utils/IdGenerator";

export class AddQuizQuestionUseCase implements IAddQuizQuestionUseCase {
    constructor(
        private _quizRepository: IQuizRepository
    ) { }

    async execute(input: AddQuizQuestionInput): Promise<QuizQuestion> {
        const quizId = input.quizId;
        const newQuestion = {
            id: IdGenerator.generate(),
            question: input.question,
            options: input.options,
            correctAnswer: input.correctAnswer,
            points: input.points,
            explanation: input.explanation,
        }
        const questionAdded = await this._quizRepository.addQuestion(quizId,newQuestion);
        if(!questionAdded){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        const question=questionAdded.questions.find(q=>q.id===newQuestion.id);
        if(!question){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        return question;
    }
}