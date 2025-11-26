import { PaymentDoc } from "../models/PaymentModel";
import { Payment } from "@domain/entities/Payment";

export class PaymentMapper {
    static toDomain(doc: PaymentDoc): Payment {

        return {
            id: doc._id.toString(),
            payerId:doc.payerId.toString(),
            payerType:doc.payerType,
            status:doc.status,
            method:doc.method,
            grossAmount:doc.grossAmount,
            paidAmount:doc.paidAmount,
            discount:doc.discount,
            coupon:doc.coupon?doc.coupon.toString():null,
            transactionId:doc.transactionId,
            refundedAt:doc.refundedAt,
            paidAt:doc.paidAt,
            createdAt:doc.createdAt,
            enrollmentId:doc.enrollmentId,
            reason:doc.reason
        };
    }


}
