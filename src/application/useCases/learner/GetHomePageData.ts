import { CategorySummary, IGetCourseCategoriesSummaryUseCase } from "@application/IUseCases/category/IGetCategorySummary";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetHomePageData{
    constructor(
        private _getCategorySummaryUseCase:IGetCourseCategoriesSummaryUseCase,
        
    ){}

    async execute():Promise<{categories:CategorySummary[]}>{
        
        const categories=await this._getCategorySummaryUseCase.execute();        
        if(!categories){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        };
        return {
            categories
        }
    }
}