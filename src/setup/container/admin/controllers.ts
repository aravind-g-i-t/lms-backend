import { AdminController } from "@presentation/http/controllers/AdminController";
import { addCategoryUseCase, adminRefreshTokenUseCase, adminSigninUseCase, createCouponUseCase, getAdminDashboardUseCase, getAllCouponsUseCase, getCategoriesUseCase, getCategoryOptionsUseCase, updateCategoryStatusUseCase, updateCategoryUseCase, updateCouponStatusUseCase, updateCouponUseCase } from "./useCases";
import { CouponController } from "@presentation/http/controllers/CouponController";
import { CategoryController } from "@presentation/http/controllers/CategoryController";

export const adminController= new AdminController(
    adminSigninUseCase,
    adminRefreshTokenUseCase,
    getAdminDashboardUseCase
)

export const couponController= new CouponController(
    createCouponUseCase,
    getAllCouponsUseCase,
    updateCouponUseCase,
    updateCouponStatusUseCase
)

export const categoryController=new CategoryController(
    addCategoryUseCase,
    getCategoriesUseCase,
    updateCategoryUseCase,
    updateCategoryStatusUseCase,
    getCategoryOptionsUseCase
);