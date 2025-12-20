import { Quiz } from "@domain/entities/Quiz";

export interface ICreateQuizUseCase{
    execute(input:{courseId:string}):Promise<Quiz>
}