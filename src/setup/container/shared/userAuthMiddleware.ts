import { createAuthMiddleware } from "@presentation/middlewares/createAuthMiddleware";
import { tokenService } from "./tokenService";
import { AuthorizationService } from "@infrastructure/services/AuthorizationService";
import { learnerRepository } from "../learner/learnerRepository";
import { instructorRepository } from "../instructor/instructorRepository";
import { businessRepository } from "../business/businessRepository";

const authorizationService=new AuthorizationService(learnerRepository,instructorRepository,businessRepository)

export const userAuthMiddleware=createAuthMiddleware(tokenService,authorizationService);