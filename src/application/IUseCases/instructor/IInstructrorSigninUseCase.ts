import { UserSigninInputDTO, UserSigninOutputDTO } from "@application/dtos/shared/Signin";




export interface IInstructorSigninUseCase {
    execute(input: UserSigninInputDTO):Promise<UserSigninOutputDTO>
}
