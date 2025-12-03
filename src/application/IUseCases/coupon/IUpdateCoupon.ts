import { UpdateCouponInputDTO } from "@application/dtos/coupon/UpdateCoupon";

export interface IUpdateCouponUseCase{
    execute(data: UpdateCouponInputDTO): Promise<void>
}