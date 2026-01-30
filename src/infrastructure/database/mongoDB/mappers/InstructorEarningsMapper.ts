import { InstructorEarnings } from "@domain/entities/InstructorEarning";
import { HydratedInstructorEarningsDoc, InstructorEarningsDoc } from "../models/InstructorEarningsModel";
import { HydratedInstructorEarnings } from "@domain/interfaces/IInstructorEarningsRepo";
import { CourseMapper } from "./CourseMapper";
import { LearnerMapper } from "./LearnerMapper";



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
}
