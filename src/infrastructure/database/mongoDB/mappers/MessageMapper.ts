import { Message } from "@domain/entities/Message";
import { MessageDoc } from "../models/MessageModel";
import { Types } from "mongoose";

export class MessageMapper {
    static toDomain(doc: MessageDoc): Message {
        return {
            id: doc._id.toString(),
            conversationId: doc.conversationId.toString(),
            senderId: doc.senderId.toString(),
            senderRole: doc.senderRole,
            content: doc.content,
            attachments: doc.attachments,
            isRead: doc.isRead,
            readAt: doc.readAt,
            createdAt: doc.createdAt,
            deletedFor:doc.deletedFor,
            isDeletedForEveryone:doc.isDeletedForEveryone
        };
    }

    static toPersistence(entity: Partial<Message>): Partial<MessageDoc> {
        const data: Partial<MessageDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.conversationId !== undefined)
            data.conversationId = new Types.ObjectId(entity.conversationId);
        if (entity.senderId !== undefined)
            data.senderId = new Types.ObjectId(entity.senderId);
        if (entity.senderRole !== undefined)
            data.senderRole = entity.senderRole;
        if (entity.content !== undefined)
            data.content = entity.content;
        if (entity.attachments !== undefined)
            data.attachments = entity.attachments;
        if (entity.isRead !== undefined)
            data.isRead = entity.isRead;
        if (entity.readAt !== undefined)
            data.readAt = entity.readAt;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.deletedFor !== undefined)
            data.deletedFor = entity.deletedFor;
        if (entity.isDeletedForEveryone !== undefined)
            data.isDeletedForEveryone = entity.isDeletedForEveryone;
        return data;
    }
}