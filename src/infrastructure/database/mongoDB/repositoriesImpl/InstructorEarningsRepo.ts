import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { InstructorEarningsModel } from "../models/InstructorEarningsModel";
import { InstructorEarningsMapper } from "../mappers/InstructorEarningsMapper";

export enum EarningStatus {
    Pending = "pending",
    Released = "released",
    Cancelled = "cancelled"
}

export interface InstructorEarningsEntity {
    id: string;
    instructorId: string;
    courseId: string;
    enrollmentId: string;
    amount: number;
    createdAt: Date;
    releaseAt: Date;
    cancelledAt: Date | null;
    status: EarningStatus;
}



export class InstructorEarningsRepositoryImpl implements IInstructorEarningsRepository {
    async create(data: InstructorEarningsEntity): Promise<InstructorEarningsEntity | null> {
        const created = await InstructorEarningsModel.create(data);
        return created ? InstructorEarningsMapper.toDomain(created) : null;
    }

    async findById(id: string): Promise<InstructorEarningsEntity | null> {
        const doc = await InstructorEarningsModel.findById(id).exec();
        return doc ? InstructorEarningsMapper.toDomain(doc) : null;
    }

    async findByInstructor(instructorId: string): Promise<InstructorEarningsEntity[]> {
        const docs = await InstructorEarningsModel
            .find({ instructorId })
            .sort({ createdAt: -1 })
            .exec();
        return docs.map(d => InstructorEarningsMapper.toDomain(d));
    }

    async findPending(beforeDate: Date): Promise<InstructorEarningsEntity[]> {
        const docs = await InstructorEarningsModel.find({
            status: EarningStatus.Pending,
            createdAt: { $lte: beforeDate }
        }).exec();

        return docs.map(d => InstructorEarningsMapper.toDomain(d));
    }

    async updateStatus(
        id: string,
        status: EarningStatus,
        releaseAt?: Date | null,
        cancelledAt?: Date | null
    ): Promise<InstructorEarningsEntity | null> {
        const doc = await InstructorEarningsModel.findByIdAndUpdate(
            id,
            {
                status,
                releaseAt: releaseAt ?? undefined,
                cancelledAt: cancelledAt ?? undefined
            },
            { new: true }
        ).exec();

        return doc ? InstructorEarningsMapper.toDomain(doc) : null;
    }
}
