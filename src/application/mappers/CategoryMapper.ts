import { CategoryForListing } from "@application/dtos/category/CategoryDTO";
import { Category } from "@domain/entities/Category";

export class CategoryDTOMapper{
    static toCategoryForListing(entity:Category):CategoryForListing{
        return {
            id:entity.id,
            name:entity.name,
            description:entity.description,
            isActive:entity.isActive
        }
    }
}