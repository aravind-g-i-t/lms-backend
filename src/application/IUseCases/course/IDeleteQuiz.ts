export interface IDeleteQuizUseCase{
    execute(input:{quizId:string,courseId:string}):Promise<void>
}