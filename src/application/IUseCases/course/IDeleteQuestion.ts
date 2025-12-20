export interface IDeleteQuizQuestionUseCase{
    execute(input:{quizId:string,questionId:string}):Promise<void>
}