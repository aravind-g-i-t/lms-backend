import { Admin } from "@domain/entities/Admin";
import { IAdminRepository } from "@domain/interfaces/IAdminRepository";
import { AdminModel } from "../models/AdminModel";
import { AdminMapper } from "../mappers/AdminMapper";
import { logger } from "@infrastructure/logging/Logger";

export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        const doc = await AdminModel.findOne({ email }).lean();
        if (doc) {
            logger.info("Fetched Admin successfully")
            return AdminMapper.toEntity(doc)
        }
        logger.warn("Failed to fetch Admin")
        return null;
    }

    async findById(id: string): Promise<Admin | null> {
        const doc = await AdminModel.findById(id).lean();
        if (doc) {
            logger.info("Fetched Admin successfully.")
            return AdminMapper.toEntity(doc)
        }
        logger.warn("Failed to fetch Admin")
        return null;
    }
}