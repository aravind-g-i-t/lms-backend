import { GetAllCouponsInput, GetAllCouponsOutput } from "@application/dtos/coupon/GetAllCoupons";

export interface IGetAllCouponsUseCase{
    execute(input: GetAllCouponsInput): Promise<GetAllCouponsOutput>
}