import { Certificate } from "@domain/entities/Certificate";
import { CertificateDoc } from "../models/CertificateModel";

export class CertificateMapper {
    static toDomain(raw: CertificateDoc): Certificate {

        return {
            id:raw._id.toString(),
            learnerId:raw.learnerId.toString(),
            courseId:raw.courseId.toString(),
            enrollmentId:raw.enrollmentId.toString(),
            quizAttemptId:raw.quizAttemptId.toString(),
            certificateNumber:raw.certificateNumber,
            issuedAt:raw.issuedAt,
            certificateUrl:raw.certificateUrl,

            courseTitle:raw.courseTitle,
            learnerName:raw.learnerName,
            instructorName:raw.instructorName,
            grade:raw.grade
        };
    }
}
