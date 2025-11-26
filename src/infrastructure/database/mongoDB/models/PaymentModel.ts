import { Schema, model, Document, Types } from "mongoose";
import {
  PayerType,
  PaymentStatus,
  PaymentMethod,
  PaymentReason,
} from "@domain/entities/Payment";

export interface PaymentDoc extends Document {
  _id: Types.ObjectId;
  payerId: Types.ObjectId;
  payerType: PayerType;
  grossAmount: number;
  paidAmount: number;
  coupon: string | null;
  discount: number | null;
  status: PaymentStatus;
  method: PaymentMethod;
  reason: PaymentReason;
  enrollmentId:string|null;
  transactionId: string|null;
  paidAt: Date | null; 
  refundedAt: Date | null;
  createdAt: Date;
}

const PaymentSchema = new Schema<PaymentDoc>(
  {
    payerId: { type: Schema.Types.ObjectId, required: true },
    payerType: {
      type: String,
      enum: Object.values(PayerType),
      required: true,
    },
    grossAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    discount: { type: Number, default: null },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon", default: null },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.Success,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    reason: {
      type: String,
      enum: Object.values(PaymentReason),
      required: true,
    },
    enrollmentId: { type: String,default:null},
    transactionId: { type: String ,default:null},
    paidAt: { type: Date ,default:null},
    refundedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const PaymentModel = model<PaymentDoc>("Payment", PaymentSchema);
