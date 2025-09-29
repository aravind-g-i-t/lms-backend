import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { BusinessModel } from "../models/BusinessModel";
import { Business } from "@domain/entities/Business";
import { BusinessMapper } from "../mappers/BusinessMapper";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class BusinessRepositoryImpl implements IBusinessRepository {

    async findByEmail(email: string,allowPassword:false): Promise<Business | null> {
        const doc = await BusinessModel.findOne({ email }).lean();
        if(!doc){
            return null
        }
        return allowPassword ? BusinessMapper.toDomain(doc) :BusinessMapper.toSecureDomain(doc) ;
    }

    async create(businessInput: Partial<Business>,allowPassword:false): Promise<Business> {

        const doc = new BusinessModel(businessInput);

        await doc.save();

        return allowPassword ? BusinessMapper.toDomain(doc) :BusinessMapper.toSecureDomain(doc) ;
    }


    async findById(id: string,allowPassword:false): Promise<Business | null> {
        const doc = await BusinessModel.findById(id);
        if(!doc){
            return null
        }
        return allowPassword ? BusinessMapper.toDomain(doc) :BusinessMapper.toSecureDomain(doc) ;
    }

    async findAll(query: Record<string, any>,
        options: { page: number; limit: number }) {
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
                                verification:1
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

    async findByIdAndUpdate(id: string, learner: Partial<Business>,allowPassword:false): Promise<Business | null> {
        const doc = await BusinessModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();

        if(!doc){
            return null
        }
        return allowPassword ? BusinessMapper.toDomain(doc) :BusinessMapper.toSecureDomain(doc) ;
    }

    async findOne(params: Partial<Business>,allowPassword:false): Promise<Business | null> {
        const doc = await BusinessModel.findOne(params);
        if(!doc){
            return null
        }
        return allowPassword ? BusinessMapper.toDomain(doc) :BusinessMapper.toSecureDomain(doc) ;
    }

    async updateOne(filter: Partial<Business>, update: Partial<Business>,allowPassword:false): Promise<Business | null> {
        const doc = await BusinessModel.findOneAndUpdate(filter, { $set: update }, { new: true });
        if(!doc){
            return null
        }
        return allowPassword ? BusinessMapper.toDomain(doc) :BusinessMapper.toSecureDomain(doc) ;
    }
}
