import { LiveSession, LiveSessionStatus } from "@domain/entities/LiveSession";
import { IBaseRepository } from "./IBaseRepository";

export interface PaginatedLiveSession {
    sessions: LiveSession[];
    totalCount: number;
    totalPages: number;
}

export interface ILiveSessionRepository extends IBaseRepository<LiveSession> {

    findManyWithPagination(input: { status?: LiveSessionStatus; search: string, filter: Partial<LiveSession>, page: number, limit: number }): Promise<PaginatedLiveSession>
    getSessionCountForTheDay(instructorId:string):Promise<number>

}