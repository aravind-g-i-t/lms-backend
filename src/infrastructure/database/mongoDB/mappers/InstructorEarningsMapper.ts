import { InstructorEarnings } from "@domain/entities/InstructorEarning";
import { InstructorEarningsDoc } from "../models/InstructorEarningsModel";



export class InstructorEarningsMapper {
    static toDomain(doc: InstructorEarningsDoc): InstructorEarnings {

        return {
            id: doc._id.toString(),
            instructorId:doc.instructorId.toString(),
            courseId:doc.courseId.toString(),
            enrollmentId:doc.enrollmentId.toString(),
            amount:doc.amount,
            createdAt:doc.createdAt,
            releaseAt:doc.releaseAt,
            cancelledAt:doc.cancelledAt,
            status:doc.status
        };
    }


}
