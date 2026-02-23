import { Certificate } from "@domain/entities/Certificate";
import { CertificateDoc } from "../models/CertificateModel";
import { Types } from "mongoose";

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

    static toPersistence(entity: Partial<Certificate>): Partial<CertificateDoc> {

        const data: Partial<CertificateDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);   
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.enrollmentId !== undefined)
            data.enrollmentId = new Types.ObjectId(entity.enrollmentId);
        if (entity.quizAttemptId !== undefined)            data.quizAttemptId = new Types.ObjectId(entity.quizAttemptId);
        if (entity.certificateNumber !== undefined)
            data.certificateNumber = entity.certificateNumber;
        if (entity.issuedAt !== undefined)
            data.issuedAt = entity.issuedAt;
        if (entity.certificateUrl !== undefined)
            data.certificateUrl = entity.certificateUrl;
        if (entity.courseTitle !== undefined)
            data.courseTitle = entity.courseTitle;
        if (entity.learnerName !== undefined)
            data.learnerName = entity.learnerName;
        if (entity.instructorName !== undefined)
            data.instructorName = entity.instructorName;
        if (entity.grade !== undefined)
            data.grade = entity.grade??null;
        return data;
    }   
}