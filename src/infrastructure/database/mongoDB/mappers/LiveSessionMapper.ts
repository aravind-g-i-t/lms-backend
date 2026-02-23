import { LiveSession } from "@domain/entities/LiveSession";
import { LiveSessionDoc } from "../models/LiveSessionModel";
import { Types } from "mongoose";

export class LiveSessionMapper{
    static toDomain(doc:LiveSessionDoc):LiveSession{
        return {
            id:doc._id.toString(),
            courseId:doc.courseId.toString(),
            courseTitle:doc.courseTitle,
            instructorId:doc.instructorId.toString(),
            instructorName:doc.instructorName,
            description:doc.description,
            status:doc.status,
            scheduledAt:doc.scheduledAt,
            startedAt:doc.startedAt,
            endedAt:doc.endedAt,
            cancelledAt:doc.cancelledAt,
            durationInMinutes:doc.durationInMinutes,
            meetingRoomId:doc.meetingRoomId,
            createdAt:doc.createdAt,
            updatedAt:doc.updatedAt,
            recordingURI:doc.recordingURI,
            isPublished:doc.isPublished
        }
    }

    static toPersistence(entity: Partial<LiveSession>): Partial<LiveSessionDoc> {
        const data: Partial<LiveSessionDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);
        if (entity.courseTitle !== undefined)
            data.courseTitle = entity.courseTitle;
        if (entity.instructorId !== undefined)
            data.instructorId = new Types.ObjectId(entity.instructorId);
        if (entity.instructorName !== undefined)
            data.instructorName = entity.instructorName;
        if (entity.description !== undefined)
            data.description = entity.description;
        if (entity.status !== undefined)
            data.status = entity.status;
        if (entity.scheduledAt !== undefined)
            data.scheduledAt = entity.scheduledAt;
        if (entity.startedAt !== undefined)
            data.startedAt = entity.startedAt;
        if (entity.endedAt !== undefined)
            data.endedAt = entity.endedAt;
        if (entity.cancelledAt !== undefined)
            data.cancelledAt = entity.cancelledAt;
        if (entity.durationInMinutes !== undefined)
            data.durationInMinutes = entity.durationInMinutes;
        if (entity.meetingRoomId !== undefined)
            data.meetingRoomId = entity.meetingRoomId;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.updatedAt !== undefined)
            data.updatedAt = entity.updatedAt;
        if (entity.recordingURI !== undefined)
            data.recordingURI = entity.recordingURI;
        if (entity.isPublished !== undefined)
            data.isPublished = entity.isPublished;

        return data;
    }
}