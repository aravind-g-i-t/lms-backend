import { GetCourseDetailsOutput } from "@application/dtos/course/GetCourseDetails";

export interface IGetCourseUseCase{
    execute(id:string):Promise<GetCourseDetailsOutput>
}