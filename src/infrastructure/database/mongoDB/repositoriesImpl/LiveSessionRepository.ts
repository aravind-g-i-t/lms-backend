import { LiveSession, LiveSessionStatus } from "@domain/entities/LiveSession";
import { BaseRepository } from "./BaseRepository";
import { LiveSessionDoc, LiveSessionModel } from "../models/LiveSessionModel";
import { LiveSessionMapper } from "../mappers/LiveSessionMapper";
import { ILiveSessionRepository, PaginatedLiveSession } from "@domain/interfaces/ILiveSessionRepository";
import { FilterQuery } from "mongoose";



export class LiveSessionRepository extends BaseRepository<LiveSession> implements ILiveSessionRepository {
    constructor() {
        super(LiveSessionModel, LiveSessionMapper)
    }

    async findManyWithPagination(input: { status?: LiveSessionStatus; search: string, filter: Partial<LiveSession>, page: number, limit: number }): Promise<PaginatedLiveSession> {
        const page = Number(input.page) || 1;
        const limit = Number(input.limit) || 10;
        const skip = (page - 1) * limit;
        const search = input.search.trim();
        const status = input.status;

        const filter: FilterQuery<LiveSessionDoc> = {
            ...input.filter,
        };


        if (status) {
            filter.status = status;
        }


        if (search) {
            filter.$or = [
                { courseTitle: { $regex: search, $options: "i" } },
                { instructorName: { $regex: search, $options: "i" } },
            ];
        }

        const [sessions, totalCount] = await Promise.all([
            this.model
                .find(filter)
                .sort({ scheduledAt: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            this.model.countDocuments(filter),
        ]);

        return {
            sessions:sessions.map((s:LiveSessionDoc)=>LiveSessionMapper.toDomain(s)),
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        };

    }
}