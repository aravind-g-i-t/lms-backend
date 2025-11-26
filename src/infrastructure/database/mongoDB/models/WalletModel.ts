import { Schema, model, Document, Types } from "mongoose";

export interface WalletDoc extends Document {
    _id: Types.ObjectId;
    learnerId: Types.ObjectId;
    balance: number
}

const WalletSchema = new Schema<WalletDoc>(
    {
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        learnerId: {
            type: Schema.Types.ObjectId,
            ref: "Learner",
            required: true,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);


export const WalletModel = model<WalletDoc>("Wallet", WalletSchema);
