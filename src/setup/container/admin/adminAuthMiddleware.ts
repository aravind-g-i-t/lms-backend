import { adminTokenService } from "./adminController";
import { createAdminAuthMiddleware } from "@presentation/middlewares/createAdminAuthMiddleware";

export const adminAuthMiddleware=createAdminAuthMiddleware(adminTokenService);