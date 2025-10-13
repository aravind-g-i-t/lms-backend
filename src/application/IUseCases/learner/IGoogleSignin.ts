import { UserSigninOutputDTO } from "@application/dtos/shared/Signin";


export interface ILearnerGoogleSigninUseCase {
    execute(token: string):Promise<UserSigninOutputDTO>
}

