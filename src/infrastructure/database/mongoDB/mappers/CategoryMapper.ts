import { CategoryDoc } from "../models/CategoryModel";
import { CategoryEntity } from "../repositoriesImpl/CategoryRepository";

export class CategoryMapper{
    static toDomain(doc:CategoryDoc):CategoryEntity{
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