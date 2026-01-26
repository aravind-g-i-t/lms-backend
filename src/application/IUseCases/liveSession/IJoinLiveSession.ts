export interface IJoinLiveSessionUseCase{
    execute(input:{learnerId:string, sessionId:string}):Promise<string>
}