export interface IStartLiveSessionUseCase{
    execute(input:{instructorId:string, sessionId:string}):Promise<string>
}