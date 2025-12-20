import { Message } from "@domain/entities/Message";
import { MessageDoc } from "../models/MessageModel";

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
            createdAt: doc.createdAt
        };
    }
}