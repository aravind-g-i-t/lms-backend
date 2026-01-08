
import { IMessageRepository } from "@domain/interfaces/IMessageRepository";
import { Message, UserRole } from "@domain/entities/Message";
import { MessageModel } from "../models/MessageModel";
import { Types } from "mongoose";
import { MessageMapper } from "../mappers/MessageMapper";
import { BaseRepository } from "./BaseRepository";

export class MessageRepositoryImpl extends BaseRepository<Message> implements IMessageRepository {

    constructor() {
        super(MessageModel, MessageMapper)
    }

    async create(message: Partial<Message>): Promise<Message> {
        const senderModel = message.senderRole === UserRole.Learner
            ? "Learner"
            : "Instructor";

        const created = await MessageModel.create({
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

        return MessageMapper.toDomain(created.toObject());
    }


    async listByConversation(
        userId: string,
        conversationId: string,
        options: { limit: number; offset: number }
    ): Promise<{ messages: Message[]; totalCount: number }> {



        const docs = await MessageModel
            .find({
                conversationId,
                deletedFor: { $ne: userId }
            })
            .sort({ createdAt: -1 })
            .skip(options.offset)
            .limit(options.limit)
            .lean()
            .exec();

        const totalCount = await MessageModel.countDocuments({ conversationId, deletedFor: { $ne: userId } })


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

    async deleteForUser(
        messageIds: string[],
        userId: string
    ): Promise<void> {
        await MessageModel.updateMany(
            {
                _id: { $in: messageIds },
            },
            {
                $addToSet: { deletedFor: userId }
            }
        );
    }


    async deleteForEveryone(
        messageIds: string[],
    ): Promise<void> {
        await MessageModel.updateMany(
            {
                _id: { $in: messageIds },
            },
            {
                $set: {
                    isDeletedForEveryone: true,
                }
            }
        );
    }


}
