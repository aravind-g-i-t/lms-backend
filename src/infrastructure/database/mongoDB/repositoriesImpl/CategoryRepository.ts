import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { CategoryDoc, CategoryModel } from "../models/CategoryModel";
import { Category } from "@domain/entities/Category";
import { logger } from "@infrastructure/logging/Logger";
import { AppError } from "shared/errors/AppError";

type AllCategoryQuery = {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
};

type FindAllCategoriesOutput={
    categories:Category[],
    totalPages:number,
    totalCount:number
}


export class CategoryRepositoryImpl implements ICategoryRepository {
    async createCategory(category: Partial<Category>): Promise<Category> {
        
        const created = await CategoryModel.create({
            name: category.name,
            description: category.description,
            isActive: category.isActive ?? true,
        });
        return this.toDomain(created);
    }

    async findById(id: string): Promise<Category | null> {
        const category = await CategoryModel.findById(id);
        return category ? this.toDomain(category) : null;
    }

    async findByName(name: string): Promise<Category | null> {
        const category = await CategoryModel.findOne({ name });
        return category ? this.toDomain(category) : null;
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
        const categories = docs.map(doc => this.toDomain(doc));
        return {
            categories,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        };
    }

    async updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
        const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
        return updated ? this.toDomain(updated) : null;
    }

    async updateCategoryStatus(id: string): Promise<Category | null> {
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
        return this.toDomain(category);
        
    }

    private toDomain(doc: CategoryDoc): Category {
        return {
            id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}
