import { QuizAttempt } from "../entities/QuizAttempt";

export interface IQuizAttemptRepository {
    create(data: Partial<QuizAttempt>): Promise<QuizAttempt|null>;
    findById(id: string): Promise<QuizAttempt | null>;
    findOne(input:Partial<QuizAttempt>): Promise<QuizAttempt | null>;
    updateById(id: string, data: Partial<QuizAttempt>): Promise<QuizAttempt | null>;
}
