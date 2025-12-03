import { GetValidCouponsOutput } from "@application/dtos/coupon/GetValidCoupons";

export interface IGetValidCouponsUseCase{
    execute(input: {amount:number}): Promise<GetValidCouponsOutput>
}