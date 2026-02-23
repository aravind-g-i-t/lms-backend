import { Quiz } from "@domain/entities/Quiz";
import { IBaseRepository } from "./IBaseRepository";

export interface IQuizRepository extends IBaseRepository<Quiz> {
    addQuestion(
        quizId: string,
        questionData: {
            id: string;
            question: string;
            options: string[];
            correctAnswer: number;
            points: number;
            explanation: string | null;
        }
    ): Promise<Quiz | null>
    updateQuestion(
        quizId: string,
        questionId: string,
        data: {
            question?: string;
            options?: string[];
            correctAnswer?: number;
            points?: number;
            explanation?: string | null;
            order?: number;
        }
    ): Promise<Quiz | null>
    deleteQuestion(
        quizId: string,
        questionId: string
    ): Promise<Quiz | null>
}
