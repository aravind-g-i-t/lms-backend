import { LearnerProgress } from "@domain/entities/LearnerProgress";
import { LearnerProgressDoc } from "../models/LearnerProgressModel";

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

            lastAccessedAt: doc.lastAccessedAt,

            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }
}
