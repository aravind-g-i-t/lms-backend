
import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { LearnerProgressModel } from "../models/LearnerProgressModel";
import { LearnerProgressMapper } from "../mappers/LeanerProgressMapper";
import { LearnerProgress } from "@domain/entities/LearnerProgress";
import { BaseRepository } from "./BaseRepository";
import { Types } from "mongoose";

export class LearnerProgressRepository extends BaseRepository<LearnerProgress> implements ILearnerProgressRepository {
    constructor() {
        super(LearnerProgressModel, LearnerProgressMapper)
    }






    async findManyByCourseIds(learnerId: string, courseIds: string[]): Promise<LearnerProgress[]> {
        const docs = await LearnerProgressModel.find({
            learnerId,
            courseId: { $in: courseIds }
        });

        return docs.map(doc => LearnerProgressMapper.toDomain(doc))
    }

    async markChapterCompleted(
        { learnerId, courseId, chapterId }
            : {
                learnerId: string,
                courseId: string,
                chapterId: string
            }
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

    async findByLearnerAndCourseAndUpdate(
        learnerId: string,
        courseId: string,
        updateData: Partial<LearnerProgress>
    ): Promise<LearnerProgress | null> {

        const updated = await LearnerProgressModel.findOneAndUpdate(
            { learnerId, courseId },
            { $set: updateData },
            { new: true }
        );

        return updated ? LearnerProgressMapper.toDomain(updated) : null;
    }


    async getAverageProgress(courseId: string): Promise<number> {
        const result = await LearnerProgressModel.aggregate([
            {
                $match: {
                    courseId: new Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    avgProgress: { $avg: "$progressPercentage" },
                },
            },
        ]);

        return result.length > 0
            ? Number(result[0].avgProgress.toFixed(2))
            : 0;
    }

    
}


