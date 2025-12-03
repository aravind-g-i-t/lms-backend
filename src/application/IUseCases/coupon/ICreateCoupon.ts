import { CreateCouponInputDTO } from "@application/dtos/coupon/CreateCoupon";
import { Coupon } from "@domain/entities/Coupon";

export interface ICreateCouponUseCase{
    execute(data: CreateCouponInputDTO): Promise<Coupon>
}