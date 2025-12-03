import { CreateCouponInputDTO } from "@application/dtos/coupon/CreateCoupon";
import { Coupon, DiscountType } from "@domain/entities/Coupon";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";

export class CreateCouponUseCase {
    constructor(private couponRepo: ICouponRepository) { }

    async execute(data: CreateCouponInputDTO): Promise<Coupon> {

        const { description, code, discountType, discountValue, maxDiscount, minCost, expiresAt, isActive, usageLimit } = data;
        const existing = await this.couponRepo.findByCode(data.code);
        if (existing) {
            throw new Error("Coupon code already exists");
        }

        if (new Date(data.expiresAt) <= new Date()) {
            throw new Error("Expiry date must be a future date");
        }

        const created = await this.couponRepo.create({
            description,
            code,
            discountType: discountType as DiscountType,
            discountValue,
            maxDiscount,
            minCost,
            expiresAt,
            isActive,
            usageLimit,
            usageCount:0
        });

        return created;
    }
}
