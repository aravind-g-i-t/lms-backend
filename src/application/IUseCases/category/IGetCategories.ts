import { GetCategoriesInput, GetCategoriesOutput } from "@application/dtos/category/GetCategories";

export interface IGetCategoriesUseCase{
    execute(input:GetCategoriesInput):Promise<GetCategoriesOutput>
};