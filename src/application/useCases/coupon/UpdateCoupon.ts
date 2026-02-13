import { UpdateCouponInputDTO } from "@application/dtos/coupon/UpdateCoupon";
import { IUpdateCouponUseCase } from "@application/IUseCases/coupon/IUpdateCoupon";
import {  DiscountType } from "@domain/entities/Coupon";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateCouponUseCase implements IUpdateCouponUseCase{
    constructor(private couponRepo: ICouponRepository) { }

    async execute(data: UpdateCouponInputDTO): Promise<void> {

        const {id, description, code, discountType, discountValue, maxDiscount, minCost, expiresAt, isActive, usageLimit } = data;
        const existing = await this.couponRepo.findOne({code:data.code});
        if (existing && existing.id !== id) {
            throw new AppError(MESSAGES.COUPON_EXISTS,STATUS_CODES.CONFLICT);
        }

        if (new Date(data.expiresAt) <= new Date()) {
            throw new AppError(MESSAGES.COUPON_EXPIRY_INVALID,STATUS_CODES.BAD_REQUEST);
        }
        if(discountType===DiscountType.Amount && discountValue>minCost){
            throw new AppError(MESSAGES.COUPON_MIN_COST_INVALID,STATUS_CODES.BAD_REQUEST)
        }

        const updated = await this.couponRepo.updateById(id,{
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
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}
