import { IStartLiveSessionUseCase } from "@application/IUseCases/liveSession/IStartLiveSession";
import { LiveSessionStatus } from "@domain/entities/LiveSession";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class StartLiveSessionUseCase implements IStartLiveSessionUseCase{
    constructor(
        private _liveSessionRepository:ILiveSessionRepository
    ){}

    async execute(input:{instructorId:string, sessionId:string}):Promise<string>{
        const {sessionId,instructorId}= input
        const liveSession= await this._liveSessionRepository.findById(sessionId);
        if(!liveSession){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        if(liveSession.instructorId!==instructorId){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        if(liveSession.status=== LiveSessionStatus.Live){
            return liveSession.meetingRoomId
        }
        if(liveSession.status!== LiveSessionStatus.Scheduled){
            throw new AppError("Live has already started",STATUS_CODES.CONFLICT);
        }

        await this._liveSessionRepository.updateById(
            sessionId,
            {
                startedAt:new Date,
                status:LiveSessionStatus.Live
            })
        
        return liveSession.meetingRoomId;
    }
}