import { GetCourseDetailsOutput } from "@application/dtos/course/GetCourseDetails";

export interface IGetCourseDetailsUseCase{
    execute(id:string):Promise<GetCourseDetailsOutput>
}