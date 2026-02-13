import { GetInstructorEarningsInput, GetInstructorEarningsOutput, IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { InstructorEarningsModel } from "../models/InstructorEarningsModel";
import { InstructorEarningsMapper } from "../mappers/InstructorEarningsMapper";
import { EarningStatus, InstructorEarnings } from "@domain/entities/InstructorEarning";
import { BaseRepository } from "./BaseRepository";
import { FilterQuery } from "mongoose";
import { CourseDoc } from "../models/CourseModel";
import { LearnerDoc } from "../models/LearnerModel";





export class InstructorEarningsRepositoryImpl extends BaseRepository<InstructorEarnings> implements IInstructorEarningsRepository {

    constructor() {
        super(InstructorEarningsModel, InstructorEarningsMapper)
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
            releaseAt: { $lte: beforeDate }
        }).exec();

        return docs.map(d => InstructorEarningsMapper.toDomain(d));
    }

    // async updateStatus(
    //     id: string,
    //     status: EarningStatus,
    //     releaseAt?: Date | null,
    //     cancelledAt?: Date | null
    // ): Promise<InstructorEarnings | null> {
    //     const doc = await InstructorEarningsModel.findByIdAndUpdate(
    //         id,
    //         {
    //             status,
    //             releaseAt: releaseAt ?? null,
    //             cancelledAt: cancelledAt ?? null
    //         },
    //         { new: true }
    //     ).exec();

    //     return doc ? InstructorEarningsMapper.toDomain(doc) : null;
    // }


    async getEarnings(
        params: GetInstructorEarningsInput
    ): Promise<GetInstructorEarningsOutput> {
        const {
            instructorId,
            page,
            limit,
            status,
        } = params;

        const skip = (page - 1) * limit;

        const query: FilterQuery<InstructorEarnings> = { instructorId };

        // status filter
        if (status) {
            query.status = status;
        }

        // search (by courseId / enrollmentId for now)
        // if (search) {
        //     query.$or = [
        //         { courseId: { $regex: search, $options: "i" } },
        //         { enrollmentId: { $regex: search, $options: "i" } },
        //     ];
        // }



        const [earnings, total] = await Promise.all([
            InstructorEarningsModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate<{courseId:CourseDoc}>("courseId")
                .populate<{learnerId:LearnerDoc}>("learnerId")

                .lean(),

            InstructorEarningsModel.countDocuments(query),
        ]);
        const mappedEarnings=earnings.map(earning=>InstructorEarningsMapper.toHydratedDomain(earning))
        return {
            earnings:mappedEarnings,
            total,
        };
    }

}
