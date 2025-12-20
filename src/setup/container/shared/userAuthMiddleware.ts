import { createAuthMiddleware } from "@presentation/http/middlewares/createAuthMiddleware";
import { tokenService } from "./tokenService";
import { AuthorizationService } from "@infrastructure/services/AuthorizationService";
import { learnerRepository } from "../learner/learnerRepository";
import { instructorRepository } from "../instructor/instructorRepository";
import { businessRepository } from "../business/businessRepository";

const authorizationService=new AuthorizationService(learnerRepository,instructorRepository,businessRepository)

export const userAuthMiddleware=createAuthMiddleware(tokenService,authorizationService);

export const learnerAuthMiddleware = createAuthMiddleware(tokenService,authorizationService,"learner");

export const instructorAuthMiddleware = createAuthMiddleware(tokenService,authorizationService,"instructor")

export const adminAuthMiddleware = createAuthMiddleware(tokenService,authorizationService,"admin")

export const businessAuthMiddleware = createAuthMiddleware(tokenService,authorizationService,"business")