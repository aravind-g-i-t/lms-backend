import { CouponModel } from "../models/CouponModel";
import { CouponMapper } from "../mappers/CouponMapper";
import { Coupon } from "@domain/entities/Coupon";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { logger } from "@infrastructure/logging/Logger";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { AppError } from "shared/errors/AppError";

export class CouponRepository implements ICouponRepository {

    async create(data: Partial<Coupon>): Promise<Coupon> {
        const created = await CouponModel.create(data);
        return CouponMapper.toDomain(created);
    }

    async findById(id: string): Promise<Coupon | null> {
        const doc = await CouponModel.findById(id);
        return doc ? CouponMapper.toDomain(doc) : null;
    }

    async findByCode(code: string): Promise<Coupon | null> {
        const doc = await CouponModel.findOne({ code });
        return doc ? CouponMapper.toDomain(doc) : null;
    }

    async findActive(): Promise<Coupon[]> {
        const docs = await CouponModel.find({
            isActive: true,
            expiresAt: { $gt: new Date() },
            $expr: {
                $lt: ["$usageCount", "$usageLimit"]
            }
        });

        return docs.map(CouponMapper.toDomain);
    }


    async findAll(input: { page: number; limit: number; search?: string, filter?: { isActive?: boolean } }): Promise<{
        coupons: Coupon[],
        totalPages: number,
        totalCount: number
    }> {
        const { page, limit, search, filter } = input;
        const query: {
            isActive?: boolean,
            code?: { $regex: string, $options: "i" }
        } = filter || {}
        if (search) {
            query.code = { $regex: escapeRegExp(search), $options: "i" };
        }

        const skip = (page - 1) * limit;
        const [docs, totalCount] = await Promise.all([
            CouponModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            CouponModel.countDocuments(query)
        ]);
        if (docs) {
            logger.info("Categories fetched successfully.");
        }
        const coupons = docs.map(doc => CouponMapper.toDomain(doc));
        return {
            coupons,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        };
    }

    async update(id: string, data: Partial<Coupon>): Promise<Coupon | null> {
        const updated = await CouponModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );
        return updated ? CouponMapper.toDomain(updated) : null;
    }

    async incrementUsage(id: string): Promise<Coupon | null> {
        const updated = await CouponModel.findByIdAndUpdate(
            id,
            { $inc: { usageCount: 1 } },
            { new: true }
        );

        return updated ? CouponMapper.toDomain(updated) : null;
    }

    async updateStatus(id: string): Promise<Coupon | null> {
        const coupon = await CouponModel.findById(id);
        if (!coupon) {
            throw new AppError("Coupon not found")
        }
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        if (!coupon) {
            logger.warn("Failed to update coupon status")
        }
        logger.info("Coupon status updated successfully.")
        return CouponMapper.toDomain(coupon);

    }
}
