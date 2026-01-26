import { LiveSession } from "@domain/entities/LiveSession";

export interface IScheduleLiveSessionUseCase{
    execute(input: { instructorId: string; courseId: string, scheduledAt: Date, durationInMinutes: number, description: string }): Promise<LiveSession>
}