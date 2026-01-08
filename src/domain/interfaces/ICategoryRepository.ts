import { Category } from "@domain/entities/Category";

type AllCategoryQuery = {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
};

type FindAllCategoriesOutput={
    categories:Category[],
    totalPages:number,
    totalCount:number
}

export interface ICategoryRepository {
  create(category: Partial<Category>): Promise<Category|null>;
  findById(id: string): Promise<Category | null>;
  findOne(input:Partial<Category>): Promise<Category | null> 
  findAll(query: AllCategoryQuery,
        options: { page: number; limit: number }): Promise<FindAllCategoriesOutput>;
  updateById(id: string, data: Partial<Category>): Promise<Category|null>;
  updateCategoryStatus(id: string): Promise<Category|null>;
  findActiveCategories():Promise<Category[]>
}
