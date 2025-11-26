import { Schema, model, Document, Types } from "mongoose";

enum WalletTxnType {
    Credit = "credit",
    Debit = "debit"
}

enum WalletTxnReason {
    CoursePurchase = "course_purchase",
    Refund = "refund",
}

export interface WalletTransactionDoc extends Document {
    _id: Types.ObjectId;
    walletId: Types.ObjectId;
    learnerId: Types.ObjectId;
    type: WalletTxnType;
    amount: number;
    reason: WalletTxnReason;
    relatedPaymentId: Types.ObjectId | null;
    relatedEnrollmentId: Types.ObjectId | null;
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

        amount: {
            type: Number,
            required: true,
        },

        reason: {
            type: String,
            enum: ["course_purchase", "refund"],
            required: true,
        },

        relatedPaymentId: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },

        relatedEnrollmentId: {
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
