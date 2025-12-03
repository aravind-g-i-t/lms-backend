import { GetAllCouponsInput, GetAllCouponsOutput } from "@application/dtos/coupon/GetAllCoupons";
import { IGetAllCouponsUseCase } from "@application/IUseCases/coupon/IGetAllCoupons";
import { ICouponRepository } from "@domain/interfaces/ICouponReposotory";


export class GetAllCouponsUseCase implements IGetAllCouponsUseCase {
    constructor(private _couponRepository: ICouponRepository) { }

    async execute(input: GetAllCouponsInput): Promise<GetAllCouponsOutput> {
        
        
        console.log(input);
        
        const { page, search, isActive, limit } = input;  
        
        const filter=isActive!==undefined?{isActive}:undefined

        const result = await this._couponRepository.findAll({
            search:search?.trim(),
            page,
            limit,
            filter
        });
        const { totalPages, totalCount ,coupons} = result;




        return { coupons, totalPages, totalCount };
    }
}
