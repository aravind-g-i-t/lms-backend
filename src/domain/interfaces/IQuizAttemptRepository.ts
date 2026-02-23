import { QuizAttempt } from "../entities/QuizAttempt";
import { IBaseRepository } from "./IBaseRepository";

export interface IQuizAttemptRepository extends IBaseRepository<QuizAttempt>  {
    create(data: Partial<QuizAttempt>): Promise<QuizAttempt|null>;
}
