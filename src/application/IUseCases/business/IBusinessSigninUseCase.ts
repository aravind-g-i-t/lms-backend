import { UserSigninInputDTO, UserSigninOutputDTO } from "@application/dtos/shared/Signin";




export interface IBusinessSigninUseCase {
    execute(input: UserSigninInputDTO):Promise<UserSigninOutputDTO>
}
