import { GetFullCourseForLearnerOutput } from "@application/dtos/course/GetFullCourseForLearner";

export interface IGetFullCourseForLearnerUseCase{
    execute({ courseId, learnerId }: { courseId: string; learnerId: string }): Promise<GetFullCourseForLearnerOutput>
}