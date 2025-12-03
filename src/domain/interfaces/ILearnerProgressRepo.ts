import { LearnerProgress } from "@domain/entities/LearnerProgress";

export interface ILearnerProgressRepository {
    create(data: Omit<LearnerProgress, "id" | "createdAt" | "updatedAt">): Promise<LearnerProgress>;
    findByLearnerAndCourse(learnerId: string, courseId: string): Promise<LearnerProgress | null>;
    findManyByCourseIds(learnerId: string, courseIds: string[]): Promise<LearnerProgress[]>;
    findByIdAndUpdate(id: string, updateData: Partial<LearnerProgress>): Promise<LearnerProgress | null>;
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
