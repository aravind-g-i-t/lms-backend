import { IScheduleLiveSessionUseCase } from "@application/IUseCases/liveSession/IScheduleLiveSession";
import { LiveSession, LiveSessionStatus } from "@domain/entities/LiveSession";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { IdGenerator } from "shared/utils/IdGenerator";

export class ScheduleLiveSessionUseCase implements IScheduleLiveSessionUseCase{
    constructor(
        private _liveSessionRepository: ILiveSessionRepository,
        private _courseRepository:ICourseRepository,
        private _instructorRepository:IInstructorRepository
    ) { }

    async execute(input: { instructorId: string; courseId: string, scheduledAt: Date, durationInMinutes?: number, description: string }): Promise<LiveSession> {
        const { instructorId, courseId, scheduledAt, durationInMinutes, description } = input;
        const course= await this._courseRepository.findById(courseId);
        if(!course){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const instructor= await this._instructorRepository.findById(instructorId);
        if(!instructor){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        
        const liveSession = await this._liveSessionRepository.create({
            courseId,
            meetingRoomId:IdGenerator.generate(),
            courseTitle:course.title,
            scheduledAt,
            durationInMinutes,
            instructorId,
            instructorName:instructor.name,
            description,
            status: LiveSessionStatus.Scheduled,
        })
        if(!liveSession){
            throw new AppError("Failed to schedule new live session",STATUS_CODES.BAD_REQUEST)
        }
        return liveSession
    }
}