import { LearnerProgress } from "@domain/entities/LearnerProgress";
import { LearnerProgressDoc } from "../models/LearnerProgressModel";
import { Types } from "mongoose";

export class LearnerProgressMapper {
    static toDomain(doc: LearnerProgressDoc): LearnerProgress {
        return {
            id: doc._id.toString(),
            learnerId: doc.learnerId.toString(),
            courseId: doc.courseId.toString(),
            
            completedChapters: doc.completedChapters,
            progressPercentage: doc.progressPercentage,

            totalChapters: doc.totalChapters,
            currentChapterId: doc.currentChapterId,

            quizAttemptId:doc.quizAttemptId ? doc.quizAttemptId.toString() : null,
            quizAttemptStatus:doc.quizAttemptStatus,

            lastAccessedAt: doc.lastAccessedAt,

            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    static toPersistence(entity: Partial<LearnerProgress>): Partial<LearnerProgressDoc> {
        const data: Partial<LearnerProgressDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.completedChapters !== undefined)
            data.completedChapters = entity.completedChapters;
        if (entity.progressPercentage !== undefined)
            data.progressPercentage = entity.progressPercentage;
        if (entity.totalChapters !== undefined)
            data.totalChapters = entity.totalChapters;
        if (entity.currentChapterId !== undefined)
            data.currentChapterId = entity.currentChapterId;
        if (entity.quizAttemptId !== undefined)
            data.quizAttemptId = entity.quizAttemptId? new Types.ObjectId(entity.quizAttemptId):null;
        if (entity.quizAttemptStatus !== undefined)
            data.quizAttemptStatus = entity.quizAttemptStatus;
        if (entity.lastAccessedAt !== undefined)
            data.lastAccessedAt = entity.lastAccessedAt;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.updatedAt !== undefined)
            data.updatedAt = entity.updatedAt;
        return data;
    }
}
