import { LearnerProgress } from "@domain/entities/LearnerProgress";
import { IBaseRepository } from "./IBaseRepository";

export interface ILearnerProgressRepository extends IBaseRepository<LearnerProgress> {
    findManyByCourseIds(learnerId: string, courseIds: string[]): Promise<LearnerProgress[]>;
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

    getAverageProgress(courseId: string): Promise<number>;

    // getModuleAnalytics(courseId: string): Promise<
    //     {
    //         moduleId: string;
    //         title: string;
    //         completionRate: number;
    //         chapters: {
    //             chapterId: string;
    //             title: string;
    //             completionRate: number;
    //             averageTimeSpent: number;
    //             dropoffRate: number;
    //         }[];
    //     }[]
    // >;

    
}
