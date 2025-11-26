import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { EnrollmentModel } from "../models/EnrollmentModel";
import { EnrollmentMapper } from "../mappers/EnrollmentMapper";

enum EnrollmentStatus {
    Pending = "pending",
    Active = "active",
    Completed = "completed",
    Cancelled = "cancelled"
}

export interface EnrollmentEntity {
    id: string;
    learnerId: string;
    courseId: string;
    enrolledAt: Date | null;
    status: EnrollmentStatus;
    paymentId: string;
    certificate: string | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
    createdAt: Date;
    instructorId: string;
    courseTitle: string;
    instructorName: string
    thumbnail: string;
    duration: number;
}

export class EnrollmentRepositoryImpl implements IEnrollmentRepository {
    async create(data: Partial<EnrollmentEntity>): Promise<EnrollmentEntity | null> {
        const created = await EnrollmentModel.create(data);
        return created ? EnrollmentMapper.toDomain(created) : null;
    }

    async findOne(filter: Partial<EnrollmentEntity>): Promise<EnrollmentEntity | null> {
        const result = await EnrollmentModel.findOne(filter).exec();
        return result ? EnrollmentMapper.toDomain(result) : null;
    }

    async findMany(filter: Partial<EnrollmentEntity>): Promise<EnrollmentEntity[]> {
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
    ): Promise<{ data: EnrollmentEntity[]; total: number }> {

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


        // Run both queries in parallel
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





    async update(id: string, updates: Partial<EnrollmentEntity>): Promise<EnrollmentEntity | null> {
        const updated = await EnrollmentModel.findByIdAndUpdate(id, updates, { new: true }).exec();
        return updated ? EnrollmentMapper.toDomain(updated) : null;
    }

    async delete(id: string): Promise<void> {
        await EnrollmentModel.findByIdAndDelete(id).exec();
    }

    async updateProgress(
        id: string,
        progress: number,
        completedChapters: string[]
    ): Promise<EnrollmentEntity | null> {
        const updated = await EnrollmentModel.findByIdAndUpdate(
            id,
            { $set: { progress, completedChapters, lastAccessedAt: new Date() } },
            { new: true }
        ).exec();
        return updated ? EnrollmentMapper.toDomain(updated) : null;
    }
}
