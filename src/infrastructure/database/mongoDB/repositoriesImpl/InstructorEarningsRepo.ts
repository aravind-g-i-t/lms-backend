import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { InstructorEarningsModel } from "../models/InstructorEarningsModel";
import { InstructorEarningsMapper } from "../mappers/InstructorEarningsMapper";
import { EarningStatus, InstructorEarnings } from "@domain/entities/InstructorEarning";
import { BaseRepository } from "./BaseRepository";





export class InstructorEarningsRepositoryImpl extends BaseRepository<InstructorEarnings> implements IInstructorEarningsRepository {
    
    constructor(){
        super(InstructorEarningsModel,InstructorEarningsMapper)
    }
   

    async findByInstructor(instructorId: string): Promise<InstructorEarnings[]> {
        const docs = await InstructorEarningsModel
            .find({ instructorId })
            .sort({ createdAt: -1 })
            .exec();
        return docs.map(d => InstructorEarningsMapper.toDomain(d));
    }

    async findPending(beforeDate: Date): Promise<InstructorEarnings[]> {
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
    ): Promise<InstructorEarnings | null> {
        const doc = await InstructorEarningsModel.findByIdAndUpdate(
            id,
            {
                status,
                releaseAt: releaseAt ?? null,
                cancelledAt: cancelledAt ?? null
            },
            { new: true }
        ).exec();

        return doc ? InstructorEarningsMapper.toDomain(doc) : null;
    }
}
