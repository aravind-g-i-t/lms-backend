import { Types } from "mongoose";
import { PaymentDoc } from "../models/PaymentModel";
import { Payment } from "@domain/entities/Payment";

export class PaymentMapper {
    static toDomain(doc: PaymentDoc): Payment {

        return {
            id: doc._id.toString(),
            payerId: doc.payerId.toString(),
            payerType: doc.payerType,
            status: doc.status,
            method: doc.method,
            grossAmount: doc.grossAmount,
            paidAmount: doc.paidAmount,
            discount: doc.discount,
            coupon: doc.coupon ? doc.coupon.toString() : null,
            transactionId: doc.transactionId,
            refundedAt: doc.refundedAt,
            paidAt: doc.paidAt,
            createdAt: doc.createdAt,
            enrollmentId: doc.enrollmentId ? doc.enrollmentId.toString() : null,
            reason: doc.reason
        };
    }

    static toPersistence(entity: Partial<Payment>): Partial<PaymentDoc> {

        const data: Partial<PaymentDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.payerId !== undefined)
            data.payerId = new Types.ObjectId(entity.payerId);
        if (entity.payerType !== undefined)
            data.payerType = entity.payerType;
        if (entity.status !== undefined)
            data.status = entity.status;
        if (entity.method !== undefined)
            data.method = entity.method;
        if (entity.grossAmount !== undefined)
            data.grossAmount = entity.grossAmount;
        if (entity.paidAmount !== undefined)
            data.paidAmount = entity.paidAmount;
        if (entity.discount !== undefined)
            data.discount = entity.discount;
        if (entity.coupon !== undefined)
            data.coupon = entity.coupon?new Types.ObjectId(entity.coupon):null;
        if (entity.transactionId !== undefined)
            data.transactionId = entity.transactionId;
        if (entity.refundedAt !== undefined)
            data.refundedAt = entity.refundedAt;
        if (entity.paidAt !== undefined)
            data.paidAt = entity.paidAt;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;
        if (entity.enrollmentId !== undefined)
            data.enrollmentId = entity.enrollmentId?new Types.ObjectId(entity.enrollmentId):null;
        if (entity.reason !== undefined)
            data.reason = entity.reason;

        return data;
    }
}