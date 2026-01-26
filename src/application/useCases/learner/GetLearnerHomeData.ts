
import { GetLearnerHomeDataOutput } from "@application/dtos/learner/GetLearnerHomeData";
import { IGetLearnerHomeDataUseCase } from "@application/IUseCases/course/IGetHomeData";
import { IGetRecommendedCoursesForLearnerUseCase } from "@application/IUseCases/course/IGetRecommended";
import { IGetEnrollmentsUseCase } from "@application/IUseCases/enrollment/IGetEnrollments";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetLearnerHomeDataUseCase implements IGetLearnerHomeDataUseCase{
    constructor(
        private _getEnrollmentsUseCase:IGetEnrollmentsUseCase,
        private _getRecommendedCoursesForLearnerUseCase:IGetRecommendedCoursesForLearnerUseCase,
    ){}

    async execute(learnerId:string):Promise<GetLearnerHomeDataOutput>{
        const enrollementData= await this._getEnrollmentsUseCase.execute({learnerId,limit:2});
        if(!enrollementData){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const {data,total}= enrollementData;

        const recommendedCourses= await this._getRecommendedCoursesForLearnerUseCase.execute({learnerId,limit:4});

        return {
            enrolledCourses:data,
            enrolledCount:total,
            recommendedCourses
        }
    }
}