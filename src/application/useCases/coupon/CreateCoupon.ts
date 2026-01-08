import { CreateCouponInputDTO } from "@application/dtos/coupon/CreateCoupon";
import { Coupon, DiscountType } from "@domain/entities/Coupon";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class CreateCouponUseCase {
    constructor(private couponRepo: ICouponRepository) { }

    async execute(data: CreateCouponInputDTO): Promise<Coupon> {

        const { description, code, discountType, discountValue, maxDiscount, minCost, expiresAt, isActive, usageLimit } = data;
        const existing = await this.couponRepo.findOne({code:data.code});
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
        if(!created){
            throw new AppError("Failed to create coupon.",STATUS_CODES.BAD_REQUEST);
        }

        return created;
    }
}
