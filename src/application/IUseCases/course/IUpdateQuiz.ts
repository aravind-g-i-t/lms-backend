export interface IUpdateQuizUseCase{
    execute(input:{quizId:string,passingScore:number,timeLimitMinutes:number|null}):Promise<void>
}