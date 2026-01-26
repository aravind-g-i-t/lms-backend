export interface CategorySummary {
  id: string;
  name: string;
  count: number;
}


export interface IGetCourseCategoriesSummaryUseCase{
    execute(): Promise<CategorySummary[]>
}