import { CategorySummary, IGetCourseCategoriesSummaryUseCase } from "@application/IUseCases/category/IGetCategorySummary";
import { ICategoryRepository } from "@domain/interfaces/ICategoryRepository";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";

export class GetCourseCategoriesSummaryUseCase implements IGetCourseCategoriesSummaryUseCase {
    constructor(
        private courseRepo: ICourseRepository,
        private categoryRepo: ICategoryRepository
    ) { }

    async execute(): Promise<CategorySummary[]> {
        const [categories, counts] = await Promise.all([
            this.categoryRepo.findMany({}),
            this.courseRepo.countCoursesByCategory()
        ]);

        const countMap = new Map(
            counts.map(c => [c.categoryId.toString(), c.count])
        );

        const totalCount = counts.reduce(
            (sum, c) => sum + c.count,
            0
        );

        const summaries: CategorySummary[] = [
            {
                id: "all",
                name: "All Courses",
                count: totalCount
            }
        ];

        for (const category of categories) {
            if (countMap.get(category.id)) {
                summaries.push({
                    id: category.id,
                    name: category.name,
                    count: countMap.get(category.id)!
                });
            }

        }

        return summaries;
    }
}
