import { GetCoursesForLearnerOutput } from "@application/dtos/course/GetCourseForLearners";

export interface IGetFavouritesUseCase{
    execute(input:{ page?: number, limit: number, search?: string; learnerId:string}):Promise<GetCoursesForLearnerOutput>
}