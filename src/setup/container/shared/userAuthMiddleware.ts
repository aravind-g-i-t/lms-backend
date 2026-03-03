import { createAuthMiddleware } from "@presentation/http/middlewares/createAuthMiddleware";
import { AuthorizationService } from "@infrastructure/services/AuthorizationService";
import { instructorRepository } from "../instructor/repositories";
import { learnerRepository } from "../learner/repostitories";
import { tokenService } from "./services";

const authorizationService=new AuthorizationService(learnerRepository,instructorRepository)

export const userAuthMiddleware=createAuthMiddleware(tokenService,authorizationService);

export const learnerAuthMiddleware = createAuthMiddleware(tokenService,authorizationService,["learner"]);

export const instructorAuthMiddleware = createAuthMiddleware(tokenService,authorizationService,["instructor"])

export const adminAuthMiddleware = createAuthMiddleware(tokenService,authorizationService,["admin"])


export const learnerInstructorAuthMiddleware= createAuthMiddleware(tokenService,authorizationService,["learner","instructor"])