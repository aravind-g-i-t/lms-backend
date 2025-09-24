import { InstructorVerification } from "@domain/entities/InstructorVerification";
import { InstructorVerificationDoc } from "../models/InstructorVerificationModel";

export class InstructorVerificationMapper {
    static toDomain(doc: InstructorVerificationDoc): InstructorVerification {

        return {
            id: doc._id.toString(),
            instructorId: doc.instructorId.toString(),
            status: doc.status,
            remarks: doc.remarks || null,
            appliedOn: doc.createdAt,
        };
    }
}