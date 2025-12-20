import { CreateCouponUseCase } from "@application/useCases/coupon/CreateCoupon";
import { GetAllCouponsUseCase } from "@application/useCases/coupon/GetAllCoupons";
import { GetValidCouponsUseCase } from "@application/useCases/coupon/GetValidCoupons";
import { UpdateCouponUseCase } from "@application/useCases/coupon/UpdateCoupon";
import { UpdateCouponStatusUseCase } from "@application/useCases/coupon/UpdateStatus";
import { CouponRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/CouponRepository";
import { CouponController } from "@presentation/http/controllers/CouponController";

export const couponRepository=new CouponRepository();

const createCouponUseCase= new CreateCouponUseCase(couponRepository);

const getAllCouponsUseCase = new GetAllCouponsUseCase(couponRepository)

const updateCouponUseCase= new UpdateCouponUseCase(couponRepository);

const updateCouponStatusUseCase= new UpdateCouponStatusUseCase(couponRepository)

export const getValidCouponsUseCase= new GetValidCouponsUseCase(
    couponRepository
)

export const couponController= new CouponController(
    createCouponUseCase,
    getAllCouponsUseCase,
    updateCouponUseCase,
    updateCouponStatusUseCase
)