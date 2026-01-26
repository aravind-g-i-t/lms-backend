import { GetLiveSessionsForLearnerOutput } from "@application/dtos/liveSession/GetLiveSessionsForLearner";

export interface IGetSessionListForLearnerUseCase{
    execute(input: { status?:string; courseId:string; page:number; limit:number }): Promise<GetLiveSessionsForLearnerOutput>
}