import { UserSigninOutputDTO } from "@application/dtos/shared/Signin";


export interface IBusinessGoogleSigninUseCase {
    execute(token: string):Promise<UserSigninOutputDTO>
    isBusinessEmail(email: string): boolean 
}

