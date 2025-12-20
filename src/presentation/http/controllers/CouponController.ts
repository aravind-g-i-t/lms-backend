
import { Request, Response, NextFunction } from "express";

import { logger } from "@infrastructure/logging/Logger";
import { ICreateCouponUseCase } from "@application/IUseCases/coupon/ICreateCoupon";
import { GetAllCouponsRequestSchema } from "@presentation/dtos/coupon/GetAllCoupons";
import { IGetAllCouponsUseCase } from "@application/IUseCases/coupon/IGetAllCoupons";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateCouponUseCase } from "@application/IUseCases/coupon/IUpdateCoupon";
import { IUpdateCouponStatusUseCase } from "@application/IUseCases/coupon/IUpdateStatus";




export class CouponController {
    constructor(
        private _createCouponUseCase:ICreateCouponUseCase,
        private _getAllCouponsUseCase:IGetAllCouponsUseCase,
        private _updateCouponUseCase:IUpdateCouponUseCase,
        private _updateCouponStatusUseCase:IUpdateCouponStatusUseCase
    ) { }

    async createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { description, isActive,code,discountType,discountValue,maxDiscount,minCost,expiresAt,usageLimit }= req.body;


            const coupon = await this._createCouponUseCase.execute({ description, isActive ,code,discountType,discountValue,maxDiscount,minCost,expiresAt,usageLimit});

            res.status(STATUS_CODES.CREATED).json({
                success: true,
                message: "Coupon created successfully",
                data: coupon,
            });
        } catch (err) {
            logger.warn("Failed to create coupon")
            next(err)
        }
    }

    async getAllCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info("Request recieved to fetch categories for listing.");
            const { query } = GetAllCouponsRequestSchema.parse(req);
            console.log(query);
            const { page, search, isActive, limit } = query;
            const response = await this._getAllCouponsUseCase.execute({ page, search, isActive, limit });
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Fetched categories successfully",
                coupons: response.coupons,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            })

        } catch (err) {
            next(err)
        }
    }

    async updateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, code, description, isActive,discountType,discountValue,maxDiscount,minCost,expiresAt,usageLimit } = req.body;
            await this._updateCouponUseCase.execute({ id, code, description, isActive,discountType,discountValue,maxDiscount,minCost,expiresAt,usageLimit });

            res.status(200).json({ success: true, message: "Coupon updated successfully" });
        } catch (err) {
            next(err)
        }
    }

    
    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.body;
            await this._updateCouponStatusUseCase.execute(id);
            res.status(200).json({
                success: true,
                message: `Coupon status updated successfully`,
            });
        } catch (err) {
            next(err)
        }
    }


    // async getCouponOptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         logger.info("Request recieved to fetch coupon options");


    //         const categories = await this._getCouponOptionsUseCase.execute();
    //         res.status(STATUS_CODES.OK).json({
    //             success: true,
    //             message: "Fetched categorie options successfully",
    //             data: { categories }
    //         });

    //     } catch (err) {
    //         next(err)
    //     }
    // }


}
