import { CategoryForListing } from "@application/dtos/category/categoryDTO";

export interface IAddCategoryUseCase {
   execute(data: { name: string; description: string; isActive:boolean}): Promise<CategoryForListing> 
}
