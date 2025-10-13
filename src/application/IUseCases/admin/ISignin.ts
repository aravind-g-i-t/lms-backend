import { AdminSigninInputDTO, AdminSigninOutputDTO } from "@application/dtos/admin/Signin";


export interface IAdminSigninUseCase{
    execute(input:AdminSigninInputDTO):Promise<AdminSigninOutputDTO>
}
