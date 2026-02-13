import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import {  CategoryModel } from "../models/CategoryModel";
import { logger } from "@infrastructure/logging/Logger";
import { AppError } from "shared/errors/AppError";
import { CategoryMapper } from "../mappers/CategoryMapper";
import { BaseRepository } from "./BaseRepository";
import { Category } from "@domain/entities/Category";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";

type AllCategoryQuery = {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
};

type FindAllCategoriesOutput={
    categories:Category[],
    totalPages:number,
    totalCount:number
}





export class CategoryRepositoryImpl extends BaseRepository<Category> implements ICategoryRepository {

    constructor(){
        super(CategoryModel,CategoryMapper)
    }

    async findAll(query: AllCategoryQuery,
        options: { page: number; limit: number }):Promise<FindAllCategoriesOutput> {
        const { page, limit } = options;
        const skip = (page - 1) * limit;
        const [docs, totalCount] = await Promise.all([
            CategoryModel.find(query)
                .select("-password -__v -updatedAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            CategoryModel.countDocuments(query)
        ]);
        if (docs) {
            logger.info("Categories fetched successfully.");
        }
        const categories = docs.map(doc => CategoryMapper.toDomain(doc));
        return {
            categories,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        };
    }

    async findActiveCategories():Promise<Category[]>{
        const docs=await CategoryModel.find({isActive:true}).lean();
        if (docs) {
            logger.info("Categories fetched successfully.");
        }
        const categories = docs.map(doc => CategoryMapper.toDomain(doc));
        return categories;
    }

    

    async updateCategoryStatus(id: string): Promise<Category | null> {
        const category = await CategoryModel.findById(id);
        if(!category){
            throw new AppError(MESSAGES.CATEGORY_NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        category.isActive = !category.isActive;
                await category.save();
                if (!category) {
                    logger.warn("Failed to update Category status")
                }
                logger.info("Category status updated successfully.")
        return CategoryMapper.toDomain(category);
    }
}
