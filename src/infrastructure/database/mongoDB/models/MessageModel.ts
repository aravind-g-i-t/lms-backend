import { Attachment, UserRole } from "@domain/entities/Message";
import { Schema, Types, model } from "mongoose";

export interface MessageDoc {
    _id: Types.ObjectId;
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderRole: UserRole;
    senderModel: "Learner" | "Instructor",

    content: string;
    attachments: Attachment[];

    isRead: boolean;
    readAt: Date | null;

    createdAt: Date;
}

const AttachmentSchema = new Schema({
    id: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true }
}, { _id: false });

const MessageSchema = new Schema<MessageDoc>({

    conversationId: { type: Schema.Types.ObjectId, required: true, ref: "Conversation" },

    senderId: { type: Schema.Types.ObjectId, required: true, refPath: "senderModel" },
    senderRole: {
        type: String,
        enum: Object.values(UserRole),
        required: true
    },
    senderModel: {
        type: String,
        required: true,
        enum: ["Learner", "Instructor"]
    },

    content: { type: String, required: true },

    attachments: {
        type: [AttachmentSchema],
        default: []
    },

    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
}, { timestamps: true }
);

export const MessageModel = model("Message", MessageSchema, "messages");
