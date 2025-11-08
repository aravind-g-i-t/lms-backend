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
  createCategory(category: Partial<Category>): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null> 
  findAll(query: AllCategoryQuery,
        options: { page: number; limit: number }): Promise<FindAllCategoriesOutput>;
  updateCategory(id: string, data: Partial<Category>): Promise<Category|null>;
  updateCategoryStatus(id: string): Promise<Category|null>;
  findActiveCategories():Promise<Category[]>
}
