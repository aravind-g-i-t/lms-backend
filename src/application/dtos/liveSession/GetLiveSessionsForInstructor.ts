import { LiveSession } from "@domain/entities/LiveSession";

export interface GetLiveSessionsForInstructorOutput{
    sessions:LiveSession[],
    totalCount:number;
    totalPages:number;
}

