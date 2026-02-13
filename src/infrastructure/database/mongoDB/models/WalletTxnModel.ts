import { TransactionReason, TransactionType } from "@domain/entities/WalletTransaction";
import { Schema, model, Document, Types } from "mongoose";
import { EnrollmentDoc } from "./EnrollmentModel";



export interface WalletTransactionDoc extends Document {
    _id: Types.ObjectId;
    walletId: Types.ObjectId;
    learnerId: Types.ObjectId;
    type: TransactionType;
    reason:TransactionReason;
    amount: number;
    enrollmentId: Types.ObjectId|null;
    createdAt:Date;
}

export interface HydratedWalletTransactionDoc {
    _id: Types.ObjectId;
    walletId: Types.ObjectId;
    learnerId: Types.ObjectId;
    type: TransactionType;
    reason: TransactionReason
    amount: number;
    enrollmentId: EnrollmentDoc|null ;
    createdAt:Date;
}


const WalletTransactionSchema = new Schema<WalletTransactionDoc>(
    {
        walletId: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
            index: true,
        },

        learnerId: {
            type: Schema.Types.ObjectId,
            ref: "Learner",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
        },
        reason:{
            type: String,
            enum:Object.values(TransactionReason),
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },


        enrollmentId: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            default: null,
        },
    },
    {
        timestamps: true
    }
);


export const WalletTransactionModel = model<WalletTransactionDoc>(
    "WalletTransaction",
    WalletTransactionSchema
);
