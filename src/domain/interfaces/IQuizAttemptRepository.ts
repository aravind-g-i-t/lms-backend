import { QuizAttempt } from "../entities/QuizAttempt";

export interface IQuizAttemptRepository {
    create(data: Partial<QuizAttempt>): Promise<QuizAttempt|null>;
    findById(id: string): Promise<QuizAttempt | null>;
    findActiveAttempt(quizId: string, learnerId: string): Promise<QuizAttempt | null>;
    findByLearner(learnerId: string): Promise<QuizAttempt[]>;
    update(id: string, data: Partial<QuizAttempt>): Promise<QuizAttempt | null>;
}
