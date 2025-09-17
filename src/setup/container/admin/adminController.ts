import { AdminRefreshTokenUseCase } from "@application/useCases/admin/RefreshToken";
import { AdminSigninUseCase } from "@application/useCases/admin/Signin";
import { AdminRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/AdminRepository";
import { TokenService } from "@infrastructure/services/TokenService";
import { AdminController } from "@presentation/controllers/AdminController";


const adminRepository=new AdminRepository();
export const adminTokenService= new TokenService(process.env.JWT_ADMIN_ACCESS_SECRET,process.env.JWT_ADMIN_REFRESH_SECRET)

const adminSigninUseCase=new AdminSigninUseCase(adminRepository,adminTokenService);

const adminRefreshTokenUseCase=new AdminRefreshTokenUseCase(adminTokenService,adminRepository)

export const adminController=new AdminController(adminSigninUseCase,adminRefreshTokenUseCase);