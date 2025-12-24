import { IGetVideoUseCase } from "@application/IUseCases/course/IGetVideo";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetVideoUseCase implements IGetVideoUseCase{
    constructor(
        private _enrollmentRepository:IEnrollmentRepository,
        private _courseRepository:ICourseRepository,
        private _cloudStorageService:IS3Service

    ){}

    async execute(input:{learnerId:string; courseId:string; moduleId:string; chapterId:string}):Promise<string>{

        const {courseId,learnerId,moduleId,chapterId}=input;

        console.log("useCase",learnerId,courseId,chapterId,moduleId);
        const isEnrolled= await this._enrollmentRepository.findOne({courseId,learnerId});
        if(!isEnrolled){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        const videoKey=await this._courseRepository.getChapterVideo({courseId,moduleId,chapterId});
        if(!videoKey){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const videoURL= await this._cloudStorageService.getDownloadUrl(videoKey);

        return videoURL
        
    }
}