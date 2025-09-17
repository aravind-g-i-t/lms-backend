import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { BusinessModel } from "../models/BusinessModel";
import { Business } from "@domain/entities/Business";
import { BusinessMapper } from "../mappers/BusinessMapper";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class BusinessRepositoryImpl implements IBusinessRepository {
    async findByEmail(email: string): Promise<Business | null> {
        const doc = await BusinessModel.findOne({ email }).lean();
        return doc ? BusinessMapper.toEntity(doc) : null;
    }

    async create(businessInput: Business): Promise<Business> {
        const doc = new BusinessModel(businessInput);
        await doc.save();
        return BusinessMapper.toEntity(doc)!;
    }


    async findById(id: string): Promise<Business | null> {
        const doc = await BusinessModel.findById(id);
        return doc ? BusinessMapper.toEntity(doc) : null;
    }

    async findAll(params: { page: number; search?: string; status?: string; limit: number; }) {
        let { page, search, status, limit } = params;
        const query: any = {};
        if (status) {
            query.isActive = (status === 'Active') ? true : false;
        }
        if (search && search.trim().length) {
            const safe = escapeRegExp(search.trim()).slice(0, 100);
            query.name = { $regex: safe, $options: "i" }
        }
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
                                planName: "$plan.name"
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

        console.log(docs);



        return {
            businesses: docs,
            totalPages,
            totalCount
        }
    }

    async updateStatus(id: string): Promise<void> {
        const business = await BusinessModel.findById(id).select("isActive");
        if (!business) throw new AppError(MESSAGES.BUSINESS_NOT_FOUND, STATUS_CODES.NOT_FOUND, false)
        business.isActive = !business.isActive;
        await business.save()
    }

    async update(id: string, learner: Partial<Business>): Promise<Business | null> {
        const doc = await BusinessModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();

        if (doc) {
            return BusinessMapper.toEntity(doc)
        }
        return null;
    }

    async findOne(params: Partial<Business>): Promise<Business | null> {
        const doc = await BusinessModel.findOne(params);
        if (doc) {
            return BusinessMapper.toEntity(doc)
        }
        return null;
    }
}
