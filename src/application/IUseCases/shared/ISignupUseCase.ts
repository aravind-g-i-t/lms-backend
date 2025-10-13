import { SignupInputDTO, SignupOutputDTO } from "@application/dtos/shared/Signup";



export interface IUserSignupUseCase {
    execute(signupInput:SignupInputDTO):Promise<SignupOutputDTO>

    isBusinessEmail(email: string): boolean;
}