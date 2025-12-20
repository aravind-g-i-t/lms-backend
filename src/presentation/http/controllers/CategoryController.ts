
import { Request, Response, NextFunction } from "express";
import { IAddCategoryUseCase } from "@application/IUseCases/category/IAddCategory";
import { logger } from "@infrastructure/logging/Logger";
import { GetCategoriesRequestSchema } from "@presentation/dtos/category/GetCategories";
import { IGetCategoriesUseCase } from "@application/IUseCases/category/IGetCategories";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { IUpdateCategoryUseCase } from "@application/IUseCases/category/IUpdateCategory";
import { IUpdateCategoryStatusUseCase } from "@application/IUseCases/category/IUpdateStatus";
import { IGetCategoryOptionsUseCase } from "@application/IUseCases/category/IGetCategoryOptions";

export class CategoryController {
    constructor(
        private _addCategoryUseCase: IAddCategoryUseCase,
        private _getCategoriesUseCase: IGetCategoriesUseCase,
        private _updateCategoryUseCase: IUpdateCategoryUseCase,
        private _updateCategoryStatusUseCase: IUpdateCategoryStatusUseCase,
        private _getCategoryOptionsUseCase: IGetCategoryOptionsUseCase
    ) { }

    async addCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, description, isActive }: { name: string, description: string, isActive: boolean } = req.body;

            if (!name || !description) {
                res.status(400).json({ success: false, message: "Name and description are required" });
                return;
            }

            const category = await this._addCategoryUseCase.execute({ name, description, isActive });

            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category,
            });
        } catch (err) {
            logger.warn("Failed to create category")
            next(err)
        }
    }

    // ✅ Get all categories
    async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info("Request recieved to fetch categories for listing.");
            const { query } = GetCategoriesRequestSchema.parse(req);

            const { page, search, status, limit } = query;
            const response = await this._getCategoriesUseCase.execute({ page, search, status, limit });
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Fetched categories successfully",
                categories: response.categories,
                totalCount: response.totalCount,
                totalPages: response.totalPages
            })

        } catch (err) {
            next(err)
        }
    }

    // ✅ Update category
    async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id, name, description, isActive } = req.body;
            await this._updateCategoryUseCase.execute({ id, name, description, isActive });

            res.status(200).json({ success: true, message: "Category updated successfully" });
        } catch (err) {
            next(err)
        }
    }

    // ✅ Block/Unblock category
    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.body;
            await this._updateCategoryStatusUseCase.execute(id);
            res.status(200).json({
                success: true,
                message: `Category status updated successfully`,
            });
        } catch (err) {
            next(err)
        }
    }


    async getCategoryOptions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info("Request recieved to fetch category options");


            const categories = await this._getCategoryOptionsUseCase.execute();
            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Fetched categorie options successfully",
                data: { categories }
            });

        } catch (err) {
            next(err)
        }
    }


}
