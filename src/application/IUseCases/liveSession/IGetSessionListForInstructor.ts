import { GetLiveSessionOutput } from "@application/dtos/liveSession/GetLiveSessionsForInstructor";

export interface IGetSessionListForInstructorUseCase{
    execute(input: { search:string; status?:string; instructorId:string; page:number; limit:number }): Promise<GetLiveSessionOutput> 
}