import { SubmitQuizAttemptOutput, SubmitQuizAttemptInput } from "@application/dtos/course/SubmitQuizAttempt";

export interface ISubmitQuizAttemptUseCase{
    execute(input:SubmitQuizAttemptInput):Promise<SubmitQuizAttemptOutput>
}