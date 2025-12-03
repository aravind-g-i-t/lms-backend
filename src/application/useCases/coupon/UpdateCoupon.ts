import { UpdateCouponInputDTO } from "@application/dtos/coupon/UpdateCoupon";
import { IUpdateCouponUseCase } from "@application/IUseCases/coupon/IUpdateCoupon";
import {  DiscountType } from "@domain/entities/Coupon";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class UpdateCouponUseCase implements IUpdateCouponUseCase{
    constructor(private couponRepo: ICouponRepository) { }

    async execute(data: UpdateCouponInputDTO): Promise<void> {

        const {id, description, code, discountType, discountValue, maxDiscount, minCost, expiresAt, isActive, usageLimit } = data;
        const existing = await this.couponRepo.findByCode(data.code);
        if (existing && existing.id !== id) {
            throw new Error("Coupon code already exists");
        }

        if (new Date(data.expiresAt) <= new Date()) {
            throw new Error("Expiry date must be a future date");
        }

        const updated = await this.couponRepo.update(id,{
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

        if(!updated){
            throw new AppError("Failed to update coupon.",STATUS_CODES.BAD_REQUEST)
        }
    }
}
