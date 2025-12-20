
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { Message, UserRole } from "@domain/entities/Message";
import { MessageModel } from "../models/MessageModel";
import { Types } from "mongoose";
import { MessageMapper } from "../mappers/MessageMapper";

export class MessageRepositoryImpl implements IMessageRepository {

    async create(message: Partial<Message>): Promise<Message> {
        const senderModel = message.senderRole === UserRole.Learner
            ? "Learner"
            : "Instructor";

        const created = await MessageModel.create({
            _id: new Types.ObjectId(message.id),
            conversationId: new Types.ObjectId(message.conversationId),
            senderId: new Types.ObjectId(message.senderId),
            senderRole: message.senderRole,
            senderModel,
            content: message.content,
            attachments: message.attachments,
            isRead: message.isRead ?? false,
            readAt: message.readAt ?? null,
            createdAt: message.createdAt ?? new Date()
        });

        return MessageMapper.toDomain(created);
    }

    async findById(id: string): Promise<Message | null> {
        const doc = await MessageModel.findById(id);
        return doc ? MessageMapper.toDomain(doc) : null;
    }

    async listByConversation(
        conversationId: string,
        options: { limit: number; offset: number }
    ): Promise<{ messages: Message[]; totalCount: number }> {



        const docs = await MessageModel
            .find({ conversationId })
            .sort({ createdAt: -1 })
            .skip(options.offset)
            .limit(options.limit)
            .exec();

        const totalCount = await MessageModel.countDocuments({ conversationId })


        return {
            messages: docs.map(doc => MessageMapper.toDomain(doc)),
            totalCount
        };
    }

    async markAsReadForRole(
        conversationId: string,
        readerRole: UserRole,
        readAt: Date
    ): Promise<void> {

        const oppositeRole =
            readerRole === UserRole.Learner
                ? UserRole.Instructor
                : UserRole.Learner;

        await MessageModel.updateMany(
            {
                conversationId,
                senderRole: oppositeRole,
                isRead: false
            },
            {
                isRead: true,
                readAt
            }
        );
    }
}
