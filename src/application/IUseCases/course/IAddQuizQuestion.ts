import { AddQuizQuestionInput } from "@application/dtos/course/AddQuizQuestions";
import { QuizQuestion } from "@domain/entities/Quiz";

export interface IAddQuizQuestionUseCase{
    execute(input:AddQuizQuestionInput):Promise<QuizQuestion>
};

