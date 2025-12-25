import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { BusinessModel } from "../models/BusinessModel";
import { Business } from "@domain/entities/Business";
import { BusinessMapper } from "../mappers/BusinessMapper";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";
import { logger } from "@infrastructure/logging/Logger";
import { FindAllBusinessesQuery, FindAllOptions, FindAllBusinessesOutput } from "@domain/types";




export class BusinessRepositoryImpl implements IBusinessRepository {

    async findByEmail(email: string, allowPassword: false): Promise<Business | null> {

        const doc = await BusinessModel.findOne({ email }).lean();
        if (!doc) {
            logger.warn("Failed to fetch Business")
            return null
        }
        logger.info("Learner fetched successfully")
        return allowPassword ? BusinessMapper.toDomain(doc) : BusinessMapper.toSecureDomain(doc);

    }


    async create(businessInput: Partial<Business>, allowPassword: false): Promise<Business> {

        const doc = new BusinessModel(businessInput);

        await doc.save();
        if (!doc) {
            logger.warn("Business creation failed")
        }
        logger.info("Business created successfully")
        return allowPassword ? BusinessMapper.toDomain(doc) : BusinessMapper.toSecureDomain(doc);

    }


    async findById(id: string, allowPassword: false): Promise<Business | null> {

        const doc = await BusinessModel.findById(id);
        if (!doc) {
            logger.warn("Failed to fetch Business")
            return null
        }
        logger.info("Fusiness fetched successfully")
        return allowPassword ? BusinessMapper.toDomain(doc) : BusinessMapper.toSecureDomain(doc);

    }

    // async findAll(query: FindAllBusinessesQuery, options: FindAllOptions): Promise<FindAllBusinessesOutput> {
        
    // }

    async findAll(query: FindAllBusinessesQuery,
        options: FindAllOptions): Promise< FindAllBusinessesOutput> {

        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const result = await BusinessModel.aggregate([
            { $match: query },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $lookup: {
                                from: "plans",
                                localField: "planId",
                                foreignField: "_id",
                                as: "plan"
                            }
                        },
                        { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                id: "$_id",
                                _id: 0,
                                name: 1,
                                email: 1,
                                isActive: 1,
                                profilePic: 1,
                                employeeCount: { $size: "$employees" },
                                planName: "$plan.name",
                                verification: 1
                            }
                        }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            }
        ]);
        const docs = result[0].data;
        const totalCount = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);
        logger.info("Businnesses fetched successfully")
        return {
            businesses: docs,
            totalPages,
            totalCount
        }

    }


    async updateStatus(id: string): Promise<void> {

        const business = await BusinessModel.findById(id).select("isActive");
        if (!business) {
            logger.warn("Failed to fetch Business for status update.")
            throw new AppError(MESSAGES.BUSINESS_NOT_FOUND, STATUS_CODES.NOT_FOUND, false)
        }
        business.isActive = !business.isActive;
        await business.save();
        if (!business) {
            logger.warn("Failed to update Business status")
        }
        logger.info("Business status updated successfully.")

    }


    async findByIdAndUpdate(id: string, business: Partial<Business>, allowPassword: false): Promise<Business | null> {

        const doc = await BusinessModel.findByIdAndUpdate(id, { $set: business }, { new: true }).lean();

        if (!doc) {
            logger.warn("Failed to update Business")
            return null
        }
        logger.info("Business updated successfully")
        return allowPassword ? BusinessMapper.toDomain(doc) : BusinessMapper.toSecureDomain(doc);

    }


    async findOne(params: Partial<Business>, allowPassword: false): Promise<Business | null> {

        const doc = await BusinessModel.findOne(params);
        if (!doc) {
            logger.warn("Failed to fetch Business")
            return null
        }
        logger.info("Business fetched successfully.")
        return allowPassword ? BusinessMapper.toDomain(doc) : BusinessMapper.toSecureDomain(doc);

    }


    async updateOne(filter: Partial<Business>, update: Partial<Business>, allowPassword: false): Promise<Business | null> {

        const doc = await BusinessModel.findOneAndUpdate(filter, { $set: update }, { new: true });
        if (!doc) {
            logger.warn("Failed to update Business")
            return null
        }
        logger.info("Business updated successfully")
        return allowPassword ? BusinessMapper.toDomain(doc) : BusinessMapper.toSecureDomain(doc);

    }
}
