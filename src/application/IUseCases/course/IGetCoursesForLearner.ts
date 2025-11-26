import { GetCoursesForLearnerOutput } from "@application/dtos/course/GetCourseForLearners";

export interface IGetCoursesForLearnerUseCase{
    execute(input:{ page?: number, limit: number, search?: string; sort: string; instructorIds?: string[]; categoryIds?: string[]; levels?: string[]; durationRange?: [number, number]; priceRange?: [number, number]; minRating?: number; }):Promise<GetCoursesForLearnerOutput>
}