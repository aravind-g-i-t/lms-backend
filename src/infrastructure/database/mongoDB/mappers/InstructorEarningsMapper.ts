import { InstructorEarnings } from "@domain/entities/InstructorEarning";
import { HydratedInstructorEarningsDoc, InstructorEarningsDoc } from "../models/InstructorEarningsModel";
import { HydratedInstructorEarnings } from "@domain/interfaces/IInstructorEarningsRepo";
import { CourseMapper } from "./CourseMapper";
import { LearnerMapper } from "./LearnerMapper";
import { Types } from "mongoose";



export class InstructorEarningsMapper {
    static toDomain(doc: InstructorEarningsDoc): InstructorEarnings {

        return {
            id: doc._id.toString(),
            instructorId:doc.instructorId.toString(),
            courseId:doc.courseId.toString(),
            enrollmentId:doc.enrollmentId.toString(),
            learnerId:doc.learnerId.toString(),
            amount:doc.amount,
            createdAt:doc.createdAt,
            releaseAt:doc.releaseAt,
            cancelledAt:doc.cancelledAt,
            status:doc.status
        };
    }

    static toHydratedDomain(doc: HydratedInstructorEarningsDoc): HydratedInstructorEarnings {        
        
        
        return {
            id: doc._id.toString(),
            instructorId:doc.instructorId.toString(),
            courseId:CourseMapper.toDomain(doc.courseId),
            enrollmentId:doc.enrollmentId.toString(),
            learnerId:LearnerMapper.toDomain(doc.learnerId),
            amount:doc.amount,
            createdAt:doc.createdAt,
            releaseAt:doc.releaseAt,
            cancelledAt:doc.cancelledAt,
            status:doc.status
        };
    }

    static toPersistence(entity: Partial<InstructorEarnings>): Partial<InstructorEarningsDoc> {

        const data: Partial<InstructorEarningsDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.instructorId !== undefined)
            data.instructorId = new Types.ObjectId(entity.instructorId);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.enrollmentId !== undefined)
            data.enrollmentId = new Types.ObjectId(entity.enrollmentId);
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.amount !== undefined)
            data.amount = entity.amount;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.releaseAt !== undefined)
            data.releaseAt = entity.releaseAt;
        if (entity.cancelledAt !== undefined)
            data.cancelledAt = entity.cancelledAt;
        if (entity.status !== undefined)
            data.status = entity.status;
        return data;
    }
}