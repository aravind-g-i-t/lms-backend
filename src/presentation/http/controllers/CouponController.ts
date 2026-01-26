import { Request, Response, NextFunction } from "express";
import { logger } from "@infrastructure/logging/Logger";
import { ICreateCouponUseCase } from "@application/IUseCases/coupon/ICreateCoupon";
import { GetAllCouponsRequestSchema } from "@presentation/dtos/coupon/GetAllCoupons";
import { IGetAllCouponsUseCase } from "@application/IUseCases/coupon/IGetAllCoupons";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateCouponUseCase } from "@application/IUseCases/coupon/IUpdateCoupon";
import { IUpdateCouponStatusUseCase } from "@application/IUseCases/coupon/IUpdateStatus";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";

export class CouponController {
    constructor(
        private _createCouponUseCase: ICreateCouponUseCase,
        private _getAllCouponsUseCase: IGetAllCouponsUseCase,
        private _updateCouponUseCase: IUpdateCouponUseCase,
        private _updateCouponStatusUseCase: IUpdateCouponStatusUseCase
    ) { }

    // ✅ Create coupon
    async createCoupon(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {
                description,
                isActive,
                code,
                discountType,
                discountValue,
                maxDiscount,
                minCost,
                expiresAt,
                usageLimit,
            } = req.body;

            const coupon = await this._createCouponUseCase.execute({
                description,
                isActive,
                code,
                discountType,
                discountValue,
                maxDiscount,
                minCost,
                expiresAt,
                usageLimit,
            });

            res
                .status(STATUS_CODES.CREATED)
                .json(
                    ResponseBuilder.success("Coupon created successfully", {
                        coupon,
                    })
                );
        } catch (err) {
            logger.warn("Failed to create coupon");
            next(err);
        }
    }

    // ✅ Get all coupons
    async getAllCoupons(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            logger.info("Request recieved to fetch coupons for listing.");
            const { query } = GetAllCouponsRequestSchema.parse(req);

            const { page, search, isActive, limit } = query;
            const result = await this._getAllCouponsUseCase.execute({
                page,
                search,
                isActive,
                limit,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Fetched coupons successfully", {
                        coupons: result.coupons,
                        totalCount: result.totalCount,
                        totalPages: result.totalPages,
                    })
                );
        } catch (err) {
            next(err);
        }
    }

    // ✅ Update coupon
    async updateCoupon(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {
                id,
                code,
                description,
                isActive,
                discountType,
                discountValue,
                maxDiscount,
                minCost,
                expiresAt,
                usageLimit,
            } = req.body;

            await this._updateCouponUseCase.execute({
                id,
                code,
                description,
                isActive,
                discountType,
                discountValue,
                maxDiscount,
                minCost,
                expiresAt,
                usageLimit,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Coupon updated successfully")
                );
        } catch (err) {
            next(err);
        }
    }

    // ✅ Block / Unblock coupon
    async updateStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.body;

            await this._updateCouponStatusUseCase.execute(id);

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Coupon status updated successfully")
                );
        } catch (err) {
            next(err);
        }
    }
}
