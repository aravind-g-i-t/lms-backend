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
}