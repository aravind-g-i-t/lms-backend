import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import {  CategoryModel } from "../models/CategoryModel";
import { logger } from "@infrastructure/logging/Logger";
import { AppError } from "shared/errors/AppError";
import { CategoryMapper } from "../mappers/CategoryMapper";

type AllCategoryQuery = {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
};

type FindAllCategoriesOutput={
    categories:CategoryEntity[],
    totalPages:number,
    totalCount:number
}

export interface CategoryEntity {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}



export class CategoryRepositoryImpl implements ICategoryRepository {
    async createCategory(category: Partial<CategoryEntity>): Promise<CategoryEntity> {
        
        const created = await CategoryModel.create({
            name: category.name,
            description: category.description,
            isActive: category.isActive ?? true,
        });
        return CategoryMapper.toDomain(created);
    }

    async findById(id: string): Promise<CategoryEntity | null> {
        const category = await CategoryModel.findById(id);
        return category ? CategoryMapper.toDomain(category) : null;
    }

    async findByName(name: string): Promise<CategoryEntity | null> {
        const category = await CategoryModel.findOne({ name });
        return category ? CategoryMapper.toDomain(category) : null;
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

    async findActiveCategories():Promise<CategoryEntity[]>{
        const docs=await CategoryModel.find({isActive:true}).lean();
        if (docs) {
            logger.info("Categories fetched successfully.");
        }
        const categories = docs.map(doc => CategoryMapper.toDomain(doc));
        return categories;
    }

    

    async updateCategory(id: string, data: Partial<CategoryEntity>): Promise<CategoryEntity | null> {
        const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
        return updated ? CategoryMapper.toDomain(updated) : null;
    }

    async updateCategoryStatus(id: string): Promise<CategoryEntity | null> {
        const category = await CategoryModel.findById(id);
        if(!category){
            throw new AppError("Category not found")
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
