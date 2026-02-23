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
            learnerName: doc.learnerName,
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
            learnerName: doc.learnerName,
            thumbnail: doc.thumbnail,
            duration: doc.duration
        };
    }

    static toPersistence(entity: Partial<Enrollment>): Partial<EnrollmentDoc> {
        const data: Partial<EnrollmentDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);

        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);

        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);

        if (entity.progressId !== undefined)
            data.progressId = entity.progressId
                ? new Types.ObjectId(entity.progressId)
                : null;

        if (entity.status !== undefined)
            data.status = entity.status;

        if (entity.paymentId !== undefined)
            data.paymentId =  new Types.ObjectId(entity.paymentId)

        if (entity.completedAt !== undefined)
            data.completedAt = entity.completedAt;

        if (entity.cancelledAt !== undefined)
            data.cancelledAt = entity.cancelledAt;

        if (entity.certificate !== undefined)
            data.certificate = entity.certificate;

        if (entity.courseTitle !== undefined)
            data.courseTitle = entity.courseTitle;

        if (entity.instructorName !== undefined)
            data.instructorName = entity.instructorName;

        if (entity.learnerName !== undefined)
            data.learnerName = entity.learnerName;

        if (entity.thumbnail !== undefined)
            data.thumbnail = entity.thumbnail;

        if (entity.duration !== undefined)
            data.duration = entity.duration;

        if (entity.instructorId !== undefined)
            data.instructorId = new Types.ObjectId(entity.instructorId);

        if(entity.enrolledAt !== undefined)
            data.enrolledAt = entity.enrolledAt;

        if(entity.createdAt !== undefined)                 data.createdAt = entity.createdAt;


        return data;
    }


}
