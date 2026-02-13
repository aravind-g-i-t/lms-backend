import { LiveSession } from "@domain/entities/LiveSession";

export interface ICancelLiveSessionUseCase{
    execute(input:{sessionId:string,instructorId:string}):Promise<LiveSession>
}