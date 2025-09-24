import { Learner } from "@domain/entities/Learner";


export interface ILearnerGoogleSigninUseCase {
    execute(token: string):Promise<LearnerGoogleSigninOutput>
}

export interface LearnerGoogleSigninOutput{
    user:Learner;
    accessToken:string;
    refreshToken:string;
    role:'learner'
}