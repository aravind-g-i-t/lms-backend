import { Category } from "@domain/entities/Category";
import { CategoryDoc } from "../models/CategoryModel";

export class CategoryMapper{
    static toDomain(doc:CategoryDoc):Category{
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