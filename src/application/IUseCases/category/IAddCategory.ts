import { CategoryForListing } from "@application/dtos/category/CategoryDTO";

export interface IAddCategoryUseCase {
   execute(data: { name: string; description: string; isActive:boolean}): Promise<CategoryForListing> 
}
