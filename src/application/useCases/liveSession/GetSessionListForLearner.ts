import { GetLiveSessionsForLearnerOutput } from "@application/dtos/liveSession/GetLiveSessionsForLearner";
import { LiveSessionStatus } from "@domain/entities/LiveSession";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";

export class GetSessionListForLearnerUseCase {
    constructor(
        private _liveSessionRepository: ILiveSessionRepository
    ) { }

    async execute(input: { status?:string; courseId:string; page:number; limit:number }): Promise<GetLiveSessionsForLearnerOutput> {
        const { status,courseId,page,limit } = input;
        const result = await this._liveSessionRepository.findManyWithPagination({
            search:"",
            filter:{courseId},
            page,
            limit,
            status: status as LiveSessionStatus
        })
        if(!result){
            throw new AppError("Failed to schedule new live session",STATUS_CODES.BAD_REQUEST)
        }
        return {
            totalCount:result.totalCount,
            totalPages:result.totalPages,
            sessions:result.sessions.map(session=>{
                return {
                    id:session.id,
                    courseTitle:session.courseTitle,
                    instructorName:session.instructorName,
                    description:session.description,
                    scheduledAt:session.scheduledAt,
                    startedAt:session.startedAt,
                    endedAt:session.endedAt,
                    durationInMinutes:session.durationInMinutes,
                    status:session.status,
                    isPublished:session.isPublished
                }
            })
        }
    }
}