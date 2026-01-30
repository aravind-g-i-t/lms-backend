import { CategorySummary } from "@application/IUseCases/category/IGetCategorySummary";

export interface IGetHomePageDataUseCase{
    execute():Promise<{categories:CategorySummary[]}>
}