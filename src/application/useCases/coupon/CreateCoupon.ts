import { CreateCouponInputDTO } from "@application/dtos/coupon/CreateCoupon";
import { ICreateCouponUseCase } from "@application/IUseCases/coupon/ICreateCoupon";
import { Coupon, DiscountType } from "@domain/entities/Coupon";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class CreateCouponUseCase implements ICreateCouponUseCase{
    constructor(private _couponRepo: ICouponRepository) { }

    async execute(data: CreateCouponInputDTO): Promise<Coupon> {

        const { description, code, discountType, discountValue, maxDiscount, minCost, expiresAt, isActive, usageLimit } = data;
        const existing = await this._couponRepo.findOne({code:data.code});
        if (existing) {
            throw new AppError(MESSAGES.COUPON_EXISTS,STATUS_CODES.CONFLICT);
        }

        if (new Date(data.expiresAt) <= new Date()) {
            throw new AppError(MESSAGES.COUPON_EXPIRY_INVALID,STATUS_CODES.BAD_REQUEST);
        }
        if(discountType===DiscountType.Amount && discountValue>minCost){
            throw new AppError(MESSAGES.COUPON_MIN_COST_INVALID,STATUS_CODES.BAD_REQUEST)
        }

        const created = await this._couponRepo.create({
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
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR);
        }

        return created;
    }
}
