import { AdminSigninUseCase } from "@application/useCases/admin/Signin";
import { adminRepository, categoryRepository, certificateRepository, couponRepository } from "./repositories";
import { s3Service, tokenService } from "../shared/services";
import { AdminRefreshTokenUseCase } from "@application/useCases/admin/RefreshToken";
import { CreateCouponUseCase } from "@application/useCases/coupon/CreateCoupon";
import { GetAllCouponsUseCase } from "@application/useCases/coupon/GetAllCoupons";
import { UpdateCouponUseCase } from "@application/useCases/coupon/UpdateCoupon";
import { UpdateCouponStatusUseCase } from "@application/useCases/coupon/UpdateStatus";
import { GetValidCouponsUseCase } from "@application/useCases/coupon/GetValidCoupons";
import { AddCategoryUseCase } from "@application/useCases/category/AddCategory";
import { GetCategoriesUseCase } from "@application/useCases/category/GetCategories";
import { UpdateCategoryUseCase } from "@application/useCases/category/UpdateCategory";
import { GetCategoryOptionsUseCase } from "@application/useCases/category/GetCategoryOptions";
import { UpdateCategoryStatusUseCase } from "@application/useCases/category/UpdateStatus";
import { GetCertificatesForLearnerUseCase } from "@application/useCases/certificate/GetCertificates";

export const adminSigninUseCase=new AdminSigninUseCase(adminRepository,tokenService);

export const adminRefreshTokenUseCase=new AdminRefreshTokenUseCase(tokenService,adminRepository)

export const createCouponUseCase= new CreateCouponUseCase(couponRepository);

export const getAllCouponsUseCase = new GetAllCouponsUseCase(couponRepository)

export const updateCouponUseCase= new UpdateCouponUseCase(couponRepository);

export const updateCouponStatusUseCase= new UpdateCouponStatusUseCase(couponRepository)

export const getValidCouponsUseCase= new GetValidCouponsUseCase(couponRepository)

export const addCategoryUseCase= new AddCategoryUseCase(categoryRepository);

export const getCategoriesUseCase= new GetCategoriesUseCase(categoryRepository);

export const updateCategoryUseCase= new UpdateCategoryUseCase(categoryRepository);

export const getCategoryOptionsUseCase=new GetCategoryOptionsUseCase(categoryRepository)

export const updateCategoryStatusUseCase = new UpdateCategoryStatusUseCase(categoryRepository);

export const getCertificatesUseCase=new GetCertificatesForLearnerUseCase(certificateRepository,s3Service);