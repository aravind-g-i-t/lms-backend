import { GetCoursesForInstructorsInput, GetCoursesForInstructorsOutput } from "@application/dtos/course/GetCourseForInstructors";

export interface IGetCoursesForInstructorUseCase{
    execute(input:GetCoursesForInstructorsInput):Promise<GetCoursesForInstructorsOutput>
}