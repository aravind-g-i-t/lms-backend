import { Enrollment } from "@domain/entities/Enrollment";
import { EnrollmentDoc, HydratedEnrollmentDoc } from "../models/EnrollmentModel";
import { LearnerMapper } from "./LearnerMapper";
import { HydratedEnrollment } from "@domain/interfaces/IEnrollmentRepository";
import { PaymentMapper } from "./PaymentMapper";
import { LearnerProgressMapper } from "./LeanerProgressMapper";
import { Types } from "mongoose";

export class EnrollmentMapper {
    static toDomain(doc: EnrollmentDoc): Enrollment {

        return {
            id: doc._id.toString(),
            learnerId: doc.learnerId.toString(),
            courseId: doc.courseId.toString(),
            progressId: doc.progressId ? doc.progressId.toString() : null,
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
            learnerName:doc.learnerName,
            thumbnail: doc.thumbnail,
            duration: doc.duration
        };
    }

    static toHydratedDomain(doc: HydratedEnrollmentDoc): HydratedEnrollment {

        return {
            id: doc._id.toString(),
            learnerId: LearnerMapper.toDomain(doc.learnerId),
            courseId: doc.courseId.toString(),
            progressId: doc.progressId ? LearnerProgressMapper.toDomain(doc.progressId) : null,
            enrolledAt: doc.enrolledAt,
            status: doc.status,
            paymentId: PaymentMapper.toDomain(doc.paymentId),
            completedAt: doc.completedAt,
            certificate: doc.certificate,
            cancelledAt: doc.cancelledAt,
            createdAt: doc.createdAt,
            instructorId: doc.instructorId.toString(),
            courseTitle: doc.courseTitle,
            instructorName: doc.instructorName,
            learnerName:doc.learnerName,
            thumbnail: doc.thumbnail,
            duration: doc.duration
        };
    }

    static toPersistence(entity: Partial<Enrollment>): Partial<EnrollmentDoc> {
        return {
            learnerId: new Types.ObjectId(entity.learnerId),
            courseId: new Types.ObjectId(entity.courseId),
            progressId: entity.progressId?new Types.ObjectId(entity.progressId):undefined,
            enrolledAt: entity.enrolledAt,
            status: entity.status,
            paymentId: entity.paymentId?new Types.ObjectId(entity.paymentId):undefined,
            completedAt: entity.completedAt,
            certificate: entity.certificate,
            cancelledAt: entity.cancelledAt,
            createdAt: entity.createdAt,
            instructorId: entity.paymentId?new Types.ObjectId(entity.paymentId):undefined,
            courseTitle: entity.courseTitle,
            instructorName: entity.instructorName,
            learnerName:entity.learnerName,
            thumbnail: entity.thumbnail,
            duration: entity.duration
        };
    }


}
