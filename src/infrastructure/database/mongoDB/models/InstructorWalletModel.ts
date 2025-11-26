import { Schema, model, Document, Types } from "mongoose";

export interface InstructorWalletDoc extends Document {
    _id: Types.ObjectId;
    instructorId: Types.ObjectId;
    pendingBalance: number;
    availableBalance: number;
}

const InstructorWalletSchema = new Schema<InstructorWalletDoc>(
    {
        instructorId: {
            type: Schema.Types.ObjectId,
            ref: "Instructor",
            required: true,
            unique: true,
            index: true,
        },

        pendingBalance: {
            type: Number,
            required: true,
            default: 0,
        },

        availableBalance: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);


export const InstructorWalletModel = model<InstructorWalletDoc>(
    "InstructorWallet",
    InstructorWalletSchema
);
