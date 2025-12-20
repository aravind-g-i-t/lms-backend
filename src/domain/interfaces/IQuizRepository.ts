import { Quiz } from "@domain/entities/Quiz";

export interface IQuizRepository {
    create(data: Partial<Quiz>): Promise<Quiz | null>;
    findById(id: string): Promise<Quiz | null>;
    findByCourse(courseId: string): Promise<Quiz | null>;
    update(id: string, data: Partial<Quiz>): Promise<Quiz | null>;
    delete(id: string): Promise<void>;
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
