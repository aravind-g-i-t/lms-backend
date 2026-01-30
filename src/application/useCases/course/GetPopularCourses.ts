import { CourseForLearnerListing } from "@application/dtos/course/CourseDTO";
import { IGetCoursesForLearnerUseCase } from "@application/IUseCases/course/IGetCoursesForLearner";
import { IGetPopularCoursesUseCase } from "@application/IUseCases/course/IGetPopularCourses";

export class GetPopularCoursesUseCase implements IGetPopularCoursesUseCase{
    constructor(
        private _getCoursesForLearnerUseCase:IGetCoursesForLearnerUseCase
    ){}
    
    async execute(input:{categoryId:string|null; limit:number}):Promise<CourseForLearnerListing[]>{
        const {categoryId,limit}=input
        let categoryIds;
        if(categoryId){
            categoryIds=[categoryId]
        }
        const courseData= await this._getCoursesForLearnerUseCase.execute({sort:"popularity",limit,learnerId:null,categoryIds});

        return courseData.courses;
    }
}