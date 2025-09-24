import { Learner } from "@domain/entities/Learner";


export interface LearnerSigninUseCaseOutput{
    user:Learner;
    accessToken:string;
    refreshToken:string;
    role:'learner'|'instructor'|'business'
}

export interface ILearnerSigninUseCase {
    execute(input: {email:string,password:string,role:'learner'|'instructor'|'business'}):Promise<LearnerSigninUseCaseOutput>
}
