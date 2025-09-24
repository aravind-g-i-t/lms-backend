import { Business } from "@domain/entities/Business";


export interface BusinessSigninUseCaseOutput{
    user:Business;
    accessToken:string;
    refreshToken:string;
    role:'learner'|'instructor'|'business'
}

export interface IBusinessSigninUseCase {
    execute(input: {email:string,password:string,role:'learner'|'instructor'|'business'}):Promise<BusinessSigninUseCaseOutput>
}
