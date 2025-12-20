import { IQuizAttemptRepository } from "@domain/interfaces/IQuizAttemptRepository";
import { QuizAttempt } from "@domain/entities/QuizAttempt";
import { QuizAttemptMapper } from "../mappers/QuizAttemptMapper";
import { QuizAttemptModel } from "../models/QuizAttempt";

export class QuizAttemptRepository implements IQuizAttemptRepository {
    async create(data: Partial<QuizAttempt>): Promise<QuizAttempt|null> {
        
        const doc = await QuizAttemptModel.create(data);
        return doc?QuizAttemptMapper.toDomain(doc):null;
    }

    async findById(id: string): Promise<QuizAttempt | null> {
        const doc = await QuizAttemptModel.findById(id).lean();
        return doc?QuizAttemptMapper.toDomain(doc):null;
    }

    async findActiveAttempt(quizId: string, learnerId: string): Promise<QuizAttempt | null> {
        const doc = await QuizAttemptModel.findOne({
            quizId,
            learnerId,
        }).lean();
        return doc?QuizAttemptMapper.toDomain(doc):null;
    }

    async findByLearner(learnerId: string): Promise<QuizAttempt[]> {
        const docs = await QuizAttemptModel.find({ learnerId }).lean();
        return docs.map(QuizAttemptMapper.toDomain);
    }

    async update(id: string, data: Partial<QuizAttempt>): Promise<QuizAttempt | null> {
        const doc = await QuizAttemptModel.findByIdAndUpdate(
            id,
            data,
            { new: true }
        ).lean();
        return doc?QuizAttemptMapper.toDomain(doc):null;;
    }
}
