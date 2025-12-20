import { Quiz } from "@domain/entities/Quiz";

export interface IGetQuizForLearnerUseCase{
    execute(input:{courseId:string,learnerId:string}):Promise<Quiz>
}