import { UserSigninOutputDTO } from "@application/dtos/shared/Signin";


export interface IInstructorGoogleSigninUseCase {
    execute(token: string):Promise<UserSigninOutputDTO>
}



