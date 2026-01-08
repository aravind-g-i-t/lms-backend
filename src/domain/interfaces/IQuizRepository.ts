import { Quiz } from "@domain/entities/Quiz";

export interface IQuizRepository {
    create(data: Partial<Quiz>): Promise<Quiz | null>;
    findById(id: string): Promise<Quiz | null>;
    findOne(input:Partial<Quiz>): Promise<Quiz | null>;
    updateById(id: string, data: Partial<Quiz>): Promise<Quiz | null>;
    deleteById(id: string): Promise<boolean>;
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
