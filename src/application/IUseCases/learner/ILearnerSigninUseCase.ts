import { UserSigninInputDTO, UserSigninOutputDTO } from "@application/dtos/shared/Signin";




export interface ILearnerSigninUseCase {
    execute(input: UserSigninInputDTO):Promise<UserSigninOutputDTO>
}
