import { Category } from "@domain/entities/Category";
import { CategoryDoc } from "../models/CategoryModel";
import { Types } from "mongoose";

export class CategoryMapper {
    static toDomain(doc: CategoryDoc): Category {
        return {
            id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    static toPersistence(entity: Partial<Category>): Partial<CategoryDoc> {
        const data: Partial<CategoryDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.name !== undefined)
            data.name = entity.name
        if (entity.description !== undefined)
            data.description = entity.description;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.isActive !== undefined)
            data.isActive = entity.isActive;
        if (entity.updatedAt !== undefined)
            data.updatedAt = entity.updatedAt;
        return data;
    }
}