import { Enrollment } from "@domain/entities/Enrollment";
import { EnrollmentDoc } from "../models/EnrollmentModel";

export class EnrollmentMapper {
    static toDomain(doc: EnrollmentDoc): Enrollment {

        return {
            id: doc._id.toString(),
            learnerId: doc.learnerId.toString(),
            courseId: doc.courseId.toString(),
            enrolledAt: doc.enrolledAt,
            status: doc.status,
            paymentId: doc.paymentId.toString(),
            completedAt: doc.completedAt,
            certificate: doc.certificate,
            cancelledAt: doc.cancelledAt,
            createdAt: doc.createdAt,
            instructorId: doc.instructorId.toString(),
            courseTitle: doc.courseTitle,
            instructorName: doc.instructorName,
            thumbnail: doc.thumbnail,
            duration: doc.duration
        };
    }


}
