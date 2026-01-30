import { CourseForLearnerListing } from "@application/dtos/course/CourseDTO";

export interface IGetPopularCoursesUseCase{
    execute(input:{categoryId:string|null; limit:number}):Promise<CourseForLearnerListing[]>
}