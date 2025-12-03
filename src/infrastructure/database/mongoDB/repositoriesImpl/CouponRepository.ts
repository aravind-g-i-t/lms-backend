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

    async isApplicable(input: { couponId: string; amount: number }): Promise<{
        applicable: boolean;
        reason?: string;
        coupon?: Coupon;
    }> {
        const { couponId, amount } = input;

        const couponDoc = await CouponModel.findById(couponId);
        if (!couponDoc) {
            return { applicable: false, reason: "Coupon not found" };
        }

        const coupon = CouponMapper.toDomain(couponDoc);

        // Check if coupon is active
        if (!coupon.isActive) {
            return { applicable: false, reason: "Coupon is inactive" };
        }

        // Check expiration
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return { applicable: false, reason: "Coupon has expired" };
        }

        // Check usage limit
        if (coupon.usageCount >= coupon.usageLimit) {
            return { applicable: false, reason: "Usage limit exceeded" };
        }

        // Check minimum purchase
        if (coupon.minCost && amount < coupon.minCost) {
            return {
                applicable: false,
                reason: `Minimum purchase amount is ${coupon.minCost}`
            };
        }

        return { applicable: true, coupon };
    }

    async applyCoupon(input: { couponId: string; amount: number }): Promise<{
        finalAmount: number;
        discount: number;
        coupon: Coupon;
    }> {
        const { couponId, amount } = input;

        const result = await this.isApplicable({ couponId, amount });

        if (!result.applicable || !result.coupon) {
            throw new AppError(result.reason || "Coupon not applicable", 400);
        }

        const coupon = result.coupon;

        let discount = 0;

        // Percentage discount
        if (coupon.discountType === "percentage") {
            discount = (amount * coupon.discountValue) / 100;

            // Apply max discount cap if exists
            if (coupon.maxDiscount) {
                discount = Math.min(discount, coupon.maxDiscount);
            }
        }

        // Flat discount
        if (coupon.discountType === "amount") {
            discount = coupon.discountValue;
        }

        const finalAmount = Math.max(amount - discount, 0);

        return {
            finalAmount,
            discount,
            coupon
        };
    }


}
