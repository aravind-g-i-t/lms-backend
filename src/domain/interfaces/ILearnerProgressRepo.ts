import { LearnerProgress } from "@domain/entities/LearnerProgress";

export interface ILearnerProgressRepository {
    create(data: Partial<LearnerProgress>): Promise<LearnerProgress|null>;
    findOne(input:Partial<LearnerProgress>): Promise<LearnerProgress | null>;
    findManyByCourseIds(learnerId: string, courseIds: string[]): Promise<LearnerProgress[]>;
    findOneAndUpdate(fiter:Partial<LearnerProgress>, data: Partial<LearnerProgress>): Promise<LearnerProgress | null> 
    updateById(id: string, updateData: Partial<LearnerProgress>): Promise<LearnerProgress | null>;
    markChapterCompleted(
        { learnerId, courseId, chapterId }
            : {
                learnerId: string,
                courseId: string,
                chapterId: string
            }
    ): Promise<LearnerProgress | null>
    findByLearnerAndCourseAndUpdate(
        learnerId: string,
        courseId: string,
        updateData: Partial<LearnerProgress>
    ): Promise<LearnerProgress | null>
}
