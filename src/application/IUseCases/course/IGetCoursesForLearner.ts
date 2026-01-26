import { GetCoursesForLearnerOutput } from "@application/dtos/course/GetCourseForLearners";

type Sort = "latest" | "rating" | "popularity" | "price_low" | "price_high"


export interface IGetCoursesForLearnerUseCase{
    execute(input:{ page?: number, limit: number, search?: string; sort: Sort; instructorIds?: string[]; categoryIds?: string[]; levels?: string[]; durationRange?: [number, number]; priceRange?: [number, number]; minRating?: number; learnerId:string |null}):Promise<GetCoursesForLearnerOutput>
}