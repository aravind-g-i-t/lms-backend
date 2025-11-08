import { Course } from "@domain/entities/Course";

export interface IUpdateCourseUseCase{
    execute(id:string,updates:Partial<Course>):Promise<void>
}