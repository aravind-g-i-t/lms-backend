import { CategoryAsRaw, CategoryForListing } from "@application/dtos/category/CategoryDTO";

export class CategoryDTOMapper{
    static toCategoryForListing(entity:CategoryAsRaw):CategoryForListing{
        return {
            id:entity.id,
            name:entity.name,
            description:entity.description,
            isActive:entity.isActive
        }
    }
}