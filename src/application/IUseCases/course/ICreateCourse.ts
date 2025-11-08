import { CourseLevel } from "@domain/entities/Course";

export interface ICreateCourseUseCase{
    execute(input:{instructorId:string, title: string; description: string; prerequisites: string[]; categoryId: string; price: number; level: CourseLevel; tags: string[]; whatYouWillLearn:string[];}):Promise<string>
}