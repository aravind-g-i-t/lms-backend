import { IEndLiveSessionUseCase } from "@application/IUseCases/liveSession/IEndLiveSession";
import { LiveSessionStatus } from "@domain/entities/LiveSession";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class EndLiveSessionUseCase implements IEndLiveSessionUseCase{
    constructor(
        private _liveSessionRepository:ILiveSessionRepository
    ){}

    async execute(input:{instructorId:string, sessionId:string}):Promise<void>{
        const {sessionId,instructorId}= input
        const liveSession= await this._liveSessionRepository.findById(sessionId);
        if(!liveSession){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        if(liveSession.instructorId!==instructorId){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        if(liveSession.status=== LiveSessionStatus.Ended){
            throw new AppError("Live has already ended",STATUS_CODES.CONFLICT);
        }

        const liveSessionEnded= await this._liveSessionRepository.updateById(
            sessionId,
            {
                status:LiveSessionStatus.Ended,
                endedAt:new Date()
            }
        );


        if(!liveSessionEnded){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
        
    }
}