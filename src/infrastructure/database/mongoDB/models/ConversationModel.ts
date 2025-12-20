import { ConversationStatus } from "@domain/entities/Conversation";
import { Schema, Types, model } from "mongoose";

export interface ConversationDoc {
    _id: Types.ObjectId;
    courseId: Types.ObjectId;
    instructorId: Types.ObjectId;
    learnerId: Types.ObjectId;

    lastMessageContent: string | null;
    lastMessageAt: Date | null;

    instructorUnreadCount: number;
    learnerUnreadCount: number;

    status: ConversationStatus;

    createdAt: Date;
    updatedAt: Date;
}


const ConversationSchema = new Schema<ConversationDoc>({

    courseId: { type: Schema.Types.ObjectId, required: true, ref: "Course" },
    instructorId: { type: Schema.Types.ObjectId, required: true, ref: "Instructor" },
    learnerId: { type: Schema.Types.ObjectId, required: true, ref: "Learner" },

    lastMessageContent: { type: String, default: null },
    lastMessageAt: { type: Date, default: null },

    instructorUnreadCount: { type: Number, default: 0 },
    learnerUnreadCount: { type: Number, default: 0 },

    status: {
        type: String,
        enum: Object.values(ConversationStatus),
        default: ConversationStatus.Active
    },
}, { timestamps: true }
);

export const ConversationModel = model(
    "Conversation",
    ConversationSchema,
    "conversations"
);
