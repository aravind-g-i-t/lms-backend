import { UpdateQuizQuestionInput } from "@application/dtos/course/UpdateQuizQuestion";
import { IUpdateQuizQuestionUseCase } from "@application/IUseCases/course/IUpdateQuizQuestion";
import { QuizQuestion } from "@domain/entities/Quiz";
import { IQuizRepository } from "@domain/interfaces/IQuizRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateQuizQuesitonUseCase implements IUpdateQuizQuestionUseCase {
    constructor(
        private _quizRepo: IQuizRepository
    ) { }

    async execute(input: UpdateQuizQuestionInput): Promise<QuizQuestion> {

        console.log("input",input);
        

        const updatedQuiz = await this._quizRepo.updateQuestion(
            input.quizId,
            input.questionId,
            {
                question: input.question,
                options: input.options,
                correctAnswer: input.correctAnswer,
                points: input.points,
                explanation: input.explanation,
                order: input.order
            }
        )
        if (!updatedQuiz) {
            throw new AppError("Failed to update question", STATUS_CODES.BAD_REQUEST)
        }
        const question = updatedQuiz.questions.find(q => q.id === input.questionId);
        if (!question) {
            throw new AppError("Failed to update question", STATUS_CODES.BAD_REQUEST)
        }
        return question;
    }
}