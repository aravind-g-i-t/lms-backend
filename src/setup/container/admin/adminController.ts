import { AdminRefreshTokenUseCase } from "@application/useCases/admin/RefreshToken";
import { AdminSigninUseCase } from "@application/useCases/admin/Signin";
import { AdminRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/AdminRepository";

import { AdminController } from "@presentation/http/controllers/AdminController";
import { tokenService } from "../shared/tokenService";


export const adminRepository=new AdminRepository();

const adminSigninUseCase=new AdminSigninUseCase(adminRepository,tokenService);

const adminRefreshTokenUseCase=new AdminRefreshTokenUseCase(tokenService,adminRepository)

export const adminController=new AdminController(adminSigninUseCase,adminRefreshTokenUseCase,);