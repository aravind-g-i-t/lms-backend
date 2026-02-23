import { Conversation, ConversationStatus } from "@domain/entities/Conversation";
import { ConversationDoc } from "../models/ConversationModel";
import { Types } from "mongoose";
import { CourseDoc } from "../models/CourseModel";
import { InstructorDoc } from "../models/InstructorModel";
import { LearnerDoc } from "../models/LearnerModel";
import { HydratedConversation } from "@domain/interfaces/IConversationRepository";
import { CourseMapper } from "./CourseMapper";
import { InstructorMapper } from "./InstructorMapper";
import { LearnerMapper } from "./LearnerMapper";

export interface HydratedConversationDoc {
    _id: Types.ObjectId;
    courseId: CourseDoc;
    instructorId: InstructorDoc;
    learnerId: LearnerDoc;

    lastMessageContent: string | null;
    lastMessageAt: Date | null;

    instructorUnreadCount: number;
    learnerUnreadCount: number;

    status: ConversationStatus;

    createdAt: Date;
    updatedAt: Date;
}


export class ConversationMapper {
    static toDomain(doc: ConversationDoc): Conversation {
        return {
            id: doc._id.toString(),
            courseId: doc.courseId.toString(),
            instructorId: doc.instructorId.toString(),
            learnerId: doc.learnerId.toString(),
            lastMessageContent: doc.lastMessageContent,
            lastMessageAt: doc.lastMessageAt,
            instructorUnreadCount: doc.instructorUnreadCount,
            learnerUnreadCount: doc.learnerUnreadCount,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    static toPopulatedDomain(doc: HydratedConversationDoc): HydratedConversation {
        return {
            id: doc._id.toString(),
            courseId: CourseMapper.toDomain(doc.courseId),
            instructorId: InstructorMapper.toSecureDomain(doc.instructorId),
            learnerId: LearnerMapper.toSecureDomain(doc.learnerId),
            lastMessageContent: doc.lastMessageContent,
            lastMessageAt: doc.lastMessageAt,
            instructorUnreadCount: doc.instructorUnreadCount,
            learnerUnreadCount: doc.learnerUnreadCount,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    static toPersistence(entity: Partial<Conversation>): Partial<ConversationDoc> {
        const data: Partial<ConversationDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);

        if (entity.courseId !== undefined)
            data.courseId = new Types.ObjectId(entity.courseId);

        if (entity.instructorId !== undefined)
            data.instructorId = new Types.ObjectId(entity.instructorId);

        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);

        if (entity.lastMessageContent !== undefined)
            data.lastMessageContent = entity.lastMessageContent;

        if (entity.lastMessageAt !== undefined)
            data.lastMessageAt = entity.lastMessageAt;

        if (entity.instructorUnreadCount !== undefined)
            data.instructorUnreadCount = entity.instructorUnreadCount;

        if (entity.learnerUnreadCount !== undefined)
            data.learnerUnreadCount = entity.learnerUnreadCount;

        if (entity.status !== undefined)
            data.status = entity.status;

        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;

        if (entity.updatedAt !== undefined)
            data.updatedAt = entity.updatedAt;

        return data;
    }
}