import { IJoinLiveSessionUseCase } from "@application/IUseCases/liveSession/IJoinLiveSession";
import { EnrollmentStatus } from "@domain/entities/Enrollment";
import { LiveSessionStatus } from "@domain/entities/LiveSession";
import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class JoinLiveSessionUseCase implements IJoinLiveSessionUseCase{
    constructor(
        private _liveSessionRepository:ILiveSessionRepository,
        private _enrollmentRepository:IEnrollmentRepository
    ){}

    async execute(input:{learnerId:string, sessionId:string}):Promise<string>{
        const {learnerId,sessionId}= input;
        const liveSession= await this._liveSessionRepository.findById(sessionId);
        if(!liveSession){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        if(liveSession.status===LiveSessionStatus.Scheduled){
            throw new AppError("Live session has not started yet",STATUS_CODES.BAD_REQUEST)
        }
        if(liveSession.status===LiveSessionStatus.Ended){
            throw new AppError("Live session has ended",STATUS_CODES.BAD_REQUEST)
        }
        if(liveSession.status===LiveSessionStatus.Cancelled){
            throw new AppError("Live session has been cancelled",STATUS_CODES.BAD_REQUEST)
        }
        const enrolled= await this._enrollmentRepository.findOne({learnerId,courseId:liveSession.courseId,status:EnrollmentStatus.Active});
        if(!enrolled){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        return liveSession.meetingRoomId
    }
}