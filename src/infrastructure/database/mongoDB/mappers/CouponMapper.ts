import { Coupon } from "@domain/entities/Coupon";
import { CouponDoc } from "../models/CouponModel";
import { Types } from "mongoose";

export class CouponMapper {
    static toDomain(doc: CouponDoc): Coupon {
        return {
            id: doc._id.toString(),
            description: doc.description,
            code: doc.code,

            discountType: doc.discountType,
            discountValue: doc.discountValue,
            maxDiscount: doc.maxDiscount,

            minCost: doc.minCost,
            expiresAt: doc.expiresAt,
            isActive: doc.isActive,

            usageLimit: doc.usageLimit,
            usageCount: doc.usageCount,

            createdAt: doc.createdAt,
        };
    }

    static toPersistence(entity: Partial<Coupon>): Partial<CouponDoc> {
        const data: Partial<CouponDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.description !== undefined)
            data.description = entity.description;
        if (entity.code !== undefined)
            data.code = entity.code;
        if (entity.discountType !== undefined)
            data.discountType = entity.discountType;
        if (entity.discountValue !== undefined)
            data.discountValue = entity.discountValue;
        if (entity.maxDiscount !== undefined)
            data.maxDiscount = entity.maxDiscount;
        if (entity.minCost !== undefined)
            data.minCost = entity.minCost;
        if (entity.expiresAt !== undefined)
            data.expiresAt = entity.expiresAt;
        if (entity.isActive !== undefined)
            data.isActive = entity.isActive;
        if (entity.usageLimit !== undefined)
            data.usageLimit = entity.usageLimit;
        if (entity.usageCount !== undefined)
            data.usageCount = entity.usageCount;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;

        return data;
    }
}