import { LiveSession } from "@domain/entities/LiveSession";
import { LiveSessionDoc } from "../models/LiveSessionModel";

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
}