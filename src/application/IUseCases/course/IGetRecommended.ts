import { CourseForLearnerListing } from "@application/dtos/course/CourseDTO";

export interface IGetRecommendedCoursesForLearnerUseCase{
    execute(input: { learnerId: string, limit: number }): Promise<CourseForLearnerListing[]>
}