import { IGetVideoUseCase } from "@application/IUseCases/course/IGetVideo";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetVideoUseCase implements IGetVideoUseCase{
    constructor(
        private _enrollmentRepository:IEnrollmentRepository,
        private _courseRepository:ICourseRepository,

    ){}

    async execute(input:{learnerId:string; courseId:string; moduleId:string; chapterId:string}):Promise<string>{

        const {courseId,learnerId,moduleId,chapterId}=input;

        const isEnrolled= await this._enrollmentRepository.findOne({courseId,learnerId});
        if(!isEnrolled){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        const videoKey=await this._courseRepository.getChapterVideo({courseId,moduleId,chapterId});
        if(!videoKey){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }

        return videoKey
        
    }
}