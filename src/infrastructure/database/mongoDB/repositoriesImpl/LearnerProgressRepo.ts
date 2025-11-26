
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { LearnerProgressModel } from "../models/LearnerProgressModel";
import { LearnerProgressMapper } from "../mappers/LeanerProgressMapper";
import { LearnerProgress } from "@domain/entities/LearnerProgress";

export class LearnerProgressRepository implements ILearnerProgressRepository {

    async create(data: Omit<LearnerProgress, "id" | "createdAt" | "updatedAt">): Promise<LearnerProgress> {
        const created = await LearnerProgressModel.create({
            learnerId: data.learnerId,
            courseId: data.courseId,

            completedChapters: data.completedChapters,
            progressPercentage: data.progressPercentage,

            totalChapters: data.totalChapters,
            currentChapterId: data.currentChapterId,
            lastAccessedAt: data.lastAccessedAt
        });

        return LearnerProgressMapper.toDomain(created);
    }

    async findByLearnerAndCourse(learnerId: string, courseId: string): Promise<LearnerProgress | null> {
        const doc = await LearnerProgressModel.findOne({ learnerId, courseId });
        return doc ? LearnerProgressMapper.toDomain(doc) : null;
    }

    async findByIdAndUpdate(id: string, updateData: Partial<LearnerProgress>): Promise<LearnerProgress | null> {
        const updated = await LearnerProgressModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        return updated ? LearnerProgressMapper.toDomain(updated) : null;
    }

    async findManyByCourseIds(learnerId: string, courseIds: string[]): Promise<LearnerProgress[]> {
        const docs = await LearnerProgressModel.find({
            learnerId,
            courseId: { $in: courseIds }
        });

        return docs.map(doc => LearnerProgressMapper.toDomain(doc))
    }

    async markChapterCompleted(
        {learnerId,courseId,chapterId}
        :{learnerId: string,
        courseId: string,
        chapterId: string}
    ): Promise<LearnerProgress | null> {

        const updated = await LearnerProgressModel.findOneAndUpdate(
            { learnerId, courseId },
            {
                $addToSet: { completedChapters: chapterId },
            },
            { new: true }
        );

        return updated ? LearnerProgressMapper.toDomain(updated) : null;
    }


}
