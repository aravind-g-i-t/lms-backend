import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { EnrollmentModel } from "../models/EnrollmentModel";
import { EnrollmentMapper } from "../mappers/EnrollmentMapper";
import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { BaseRepository } from "./BaseRepository";



export class EnrollmentRepositoryImpl extends BaseRepository<Enrollment> implements IEnrollmentRepository {

    constructor(){
        super(EnrollmentModel,EnrollmentMapper)
    }

    async findMany(filter: Partial<Enrollment>): Promise<Enrollment[]> {
        const results = await EnrollmentModel.find(filter).exec();
        return results.map(r => EnrollmentMapper.toDomain(r));
    }

    async findPaginatedEnrollments(
       {learnerId,search,page,limit,filter}:
        {learnerId: string,
        search: string | null,
        page: number,
        limit: number,
        filter?: {
            instructorIds?: string[];
            status?: EnrollmentStatus[]
        }}
    ): Promise<{ data: Enrollment[]; total: number }> {

        const skip = (page - 1) * limit;

        // Base filter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {
            learnerId
        };

        if (search) {
            query.$or = [
                { courseTitle: { $regex: search, $options: "i" } },
                { instructorName: { $regex: search, $options: "i" } }
            ];
        }

        if (filter?.instructorIds?.length) {
            query.instructorId = { $in: filter.instructorIds };
        }

        if (filter?.status?.length) {
            query.status = { $in: filter.status };
        }

        const [rows, total] = await Promise.all([
            EnrollmentModel.find(query)
                .skip(skip)
                .limit(limit)
                .exec(),

            EnrollmentModel.countDocuments(query)
        ]);

        return {
            data: rows.map(r => EnrollmentMapper.toDomain(r)),
            total
        };
    }



    async updateProgress(
        id: string,
        progress: number,
        completedChapters: string[]
    ): Promise<Enrollment | null> {
        const updated = await EnrollmentModel.findByIdAndUpdate(
            id,
            { $set: { progress, completedChapters, lastAccessedAt: new Date() } },
            { new: true }
        ).exec();
        return updated ? EnrollmentMapper.toDomain(updated) : null;
    }
}
