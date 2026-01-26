import { GetLiveSessionsForInstructorOutput } from "@application/dtos/liveSession/GetLiveSessionsForInstructor";
import { IGetSessionListForInstructorUseCase } from "@application/IUseCases/liveSession/IGetSessionListForInstructor";
import { LiveSessionStatus } from "@domain/entities/LiveSession";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class GetSessionListForInstructorUseCase implements IGetSessionListForInstructorUseCase{
    constructor(
        private _liveSessionRepository: ILiveSessionRepository
    ) { }

    async execute(input: { search:string; status?:string; instructorId:string; page:number; limit:number }): Promise<GetLiveSessionsForInstructorOutput> {
        const { search,status,instructorId,page,limit } = input;
        const result = await this._liveSessionRepository.findManyWithPagination({
            search,
            filter:{instructorId},
            page,
            limit,
            status: status as LiveSessionStatus
        })
        if(!result){
            throw new AppError("Failed to schedule new live session",STATUS_CODES.BAD_REQUEST)
        }
        return result
    }
}