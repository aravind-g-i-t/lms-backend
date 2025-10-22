import { GetCategoriesInput, GetCategoriesOutput } from "@application/dtos/category/GetCategories";
import { IGetCategoriesUseCase } from "@application/IUseCases/category/IGetCategories";
import { CategoryDTOMapper } from "@application/mappers/CategoryMapper";
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { escapeRegExp } from "shared/utils/escapeRegExp";

type LearnerQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
};

export class GetCategoriesUseCase implements IGetCategoriesUseCase {
    constructor(
        private _categoryRepository: ICategoryRepository,
    ) {}

    async execute(input: GetCategoriesInput): Promise<GetCategoriesOutput> {
        const { page, search, status, limit } = input;
                
        const query: LearnerQuery = {};
        if (status) query.isActive = status === "Active";
        if (search?.trim()) {
            query.name = { $regex: escapeRegExp(search.trim()).slice(0, 100), $options: "i" };
        }

        const result = await this._categoryRepository.findAll(query, { page, limit });
        const { totalPages, totalCount } = result;

        
        const categories = await Promise.all(
            result.categories.map(async category => {
                return CategoryDTOMapper.toCategoryForListing(category);
            })
        );

        return { categories, totalPages, totalCount };
    }
};