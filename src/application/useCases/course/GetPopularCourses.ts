import { IGetCoursesForLearnerUseCase } from "@application/IUseCases/course/IGetCoursesForLearner";

export class GetPopularCoursesUseCase{
    constructor(
        private _getCoursesForLearnerUseCase:IGetCoursesForLearnerUseCase
    ){}
    
    async execute(input:{categoryId:string|null; limit:number}){
        const {categoryId,limit}=input
        let categoryIds;
        if(categoryId){
            categoryIds=[categoryId]
        }
        const courseData= await this._getCoursesForLearnerUseCase.execute({sort:"popularity",limit,learnerId:null,categoryIds});

        return courseData.courses;
    }
}