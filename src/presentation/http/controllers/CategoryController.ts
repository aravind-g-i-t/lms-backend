import { Request, Response, NextFunction } from "express";
import { IAddCategoryUseCase } from "@application/IUseCases/category/IAddCategory";
import { logger } from "@infrastructure/logging/Logger";
import { GetCategoriesRequestSchema } from "@presentation/dtos/category/GetCategories";
import { IGetCategoriesUseCase } from "@application/IUseCases/category/IGetCategories";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateCategoryUseCase } from "@application/IUseCases/category/IUpdateCategory";
import { IUpdateCategoryStatusUseCase } from "@application/IUseCases/category/IUpdateStatus";
import { IGetCategoryOptionsUseCase } from "@application/IUseCases/category/IGetCategoryOptions";
import { ResponseBuilder } from "shared/utils/ResponseBuilder";
import { AppError } from "shared/errors/AppError";
// import { IGetCourseCategoriesSummaryUseCase } from "@application/IUseCases/category/IGetCategorySummary";

export class CategoryController {
    constructor(
        private _addCategoryUseCase: IAddCategoryUseCase,
        private _getCategoriesUseCase: IGetCategoriesUseCase,
        private _updateCategoryUseCase: IUpdateCategoryUseCase,
        private _updateCategoryStatusUseCase: IUpdateCategoryStatusUseCase,
        private _getCategoryOptionsUseCase: IGetCategoryOptionsUseCase,
        // private _getCategorySummaryUseCase:IGetCourseCategoriesSummaryUseCase
    ) { }

    async addCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { name, description, isActive } = req.body;

            if (!name || !description) {
                throw new AppError(
                    "Name and description are required",
                    STATUS_CODES.BAD_REQUEST
                );
            }

            const category = await this._addCategoryUseCase.execute({
                name,
                description,
                isActive,
            });

            res
                .status(STATUS_CODES.CREATED)
                .json(
                    ResponseBuilder.success("Category created successfully", {
                        category,
                    })
                );
        } catch (err) {
            logger.warn("Failed to create category");
            next(err);
        }
    }

    async getAllCategories(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            logger.info("Request recieved to fetch categories for listing.");
            const { query } = GetCategoriesRequestSchema.parse(req);

            const { page, search, status, limit } = query;
            const result = await this._getCategoriesUseCase.execute({
                page,
                search,
                status,
                limit,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Fetched categories successfully", {
                        categories: result.categories,
                        totalCount: result.totalCount,
                        totalPages: result.totalPages,
                    })
                );
        } catch (err) {
            next(err);
        }
    }

    async updateCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id, name, description, isActive } = req.body;

            await this._updateCategoryUseCase.execute({
                id,
                name,
                description,
                isActive,
            });

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Category updated successfully")
                );
        } catch (err) {
            next(err);
        }
    }

    async updateStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id } = req.body;

            await this._updateCategoryStatusUseCase.execute(id);

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Category status updated successfully")
                );
        } catch (err) {
            next(err);
        }
    }

    async getCategoryOptions(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            logger.info("Request recieved to fetch category options");

            const categories = await this._getCategoryOptionsUseCase.execute();

            res
                .status(STATUS_CODES.OK)
                .json(
                    ResponseBuilder.success("Fetched category options successfully", {
                        categories,
                    })
                );
        } catch (err) {
            next(err);
        }
    }

    // async getCategorySummary(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ): Promise<void> {
    //     try {
    //         logger.info("Request recieved to fetch category options");

    //         const categories = await this._getCategorySummaryUseCase.execute();

    //         res.status(STATUS_CODES.OK)
    //             .json(
    //                 ResponseBuilder.success("Fetched category options successfully", {
    //                     categories,
    //                 })
    //             );
    //     } catch (err) {
    //         next(err);
    //     }
    // }

}
