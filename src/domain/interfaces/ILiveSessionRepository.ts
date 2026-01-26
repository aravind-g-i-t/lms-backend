import { LiveSession, LiveSessionStatus } from "@domain/entities/LiveSession";

export interface PaginatedLiveSession {
    sessions: LiveSession[];
    totalCount: number;
    totalPages: number;
}

export interface ILiveSessionRepository {
    create(input: Partial<LiveSession>): Promise<LiveSession | null>

    findManyWithPagination(input: { status?: LiveSessionStatus; search: string, filter: Partial<LiveSession>, page: number, limit: number }): Promise<PaginatedLiveSession>

    findById(id: string): Promise<LiveSession | null>;
    updateById(id: string, data: Partial<LiveSession>): Promise<LiveSession | null>
}