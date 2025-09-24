import { Business } from "@domain/entities/Business";


export interface IBusinessGoogleSigninUseCase {
    execute(token: string):Promise<BusinessGoogleSigninOutput>
    isBusinessEmail(email: string): boolean 
}

export interface BusinessGoogleSigninOutput{
    user:Business;
    accessToken:string;
    refreshToken:string;
    role:'business'
}