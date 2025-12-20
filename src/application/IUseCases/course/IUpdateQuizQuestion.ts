import { UpdateQuizQuestionInput } from "@application/dtos/course/UpdateQuizQuestion";
import { QuizQuestion } from "@domain/entities/Quiz";

export interface IUpdateQuizQuestionUseCase{
    execute(input:UpdateQuizQuestionInput):Promise<QuizQuestion>
}

