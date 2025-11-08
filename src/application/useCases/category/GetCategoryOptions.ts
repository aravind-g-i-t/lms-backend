import { Category } from "@domain/entities/Category";
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";

export class GetCategoryOptionsUseCase{
    constructor(
        private _categoryRepository:ICategoryRepository
    ){}
    async execute():Promise<{id:string;name:string;}[]>{
        const categories= await this._categoryRepository.findActiveCategories();
        return categories.map(c=>this._toCategoryOptions(c));
    }

    private _toCategoryOptions(category:Category):{id:string;name:string;}{
        return {
            id:category.id,
            name:category.name
        }
    }
}