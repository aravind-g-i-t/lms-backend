import { ICancelLiveSessionUseCase } from "@application/IUseCases/liveSession/ICancelLiveSession";
import { LiveSession, LiveSessionStatus } from "@domain/entities/LiveSession";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class CancelLiveSessionUseCase implements ICancelLiveSessionUseCase{
    constructor(
        private _liveSessionRepo:ILiveSessionRepository
    ){}

    async execute(input:{sessionId:string,instructorId:string}):Promise<LiveSession>{
        const {sessionId,instructorId}=input;

        const liveSession= await this._liveSessionRepo.findById(sessionId);
        if(!liveSession){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND);
        }
        if(liveSession.instructorId!==instructorId){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        if(liveSession.status===LiveSessionStatus.Live){
            throw new AppError("Session is already live.",STATUS_CODES.BAD_REQUEST)
        }
        if(liveSession.status===LiveSessionStatus.Ended){
            throw new AppError("Session has already ended.",STATUS_CODES.BAD_REQUEST)
        }
        if(liveSession.status===LiveSessionStatus.Cancelled){
            throw new AppError("Session is already cancelled.",STATUS_CODES.BAD_REQUEST)
        }
        const liveSessionUpdated=await this._liveSessionRepo.updateById(
            sessionId,
            {
                status:LiveSessionStatus.Cancelled,
                cancelledAt:new Date()
            }
        );
        if(!liveSessionUpdated){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.NOT_MODIFIED)
        }
        return liveSessionUpdated;
    }
}