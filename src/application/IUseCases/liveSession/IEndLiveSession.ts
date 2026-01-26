export interface IEndLiveSessionUseCase{
    execute(input:{instructorId:string, sessionId:string}):Promise<void>
}