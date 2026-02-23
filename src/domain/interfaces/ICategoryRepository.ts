import { Category } from "@domain/entities/Category";
import { IBaseRepository } from "./IBaseRepository";

type AllCategoryQuery = {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
};

type FindAllCategoriesOutput={
    categories:Category[],
    totalPages:number,
    totalCount:number
}

export interface ICategoryRepository extends IBaseRepository<Category> {
  findAll(query: AllCategoryQuery,
        options: { page: number; limit: number }): Promise<FindAllCategoriesOutput>;
  updateCategoryStatus(id: string): Promise<Category|null>;
  findActiveCategories():Promise<Category[]>

}
