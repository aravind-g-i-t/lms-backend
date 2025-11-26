import { IPaymentRepository } from "@domain/interfaces/IPaymentRepository";
import { PaymentModel } from "../models/PaymentModel";
import { PaymentMapper } from "../mappers/PaymentMapper";
import { Payment, PaymentReason } from "@domain/entities/Payment";


enum PayerType {
    Learner = "learner",
    Business = "business"
}



enum PaymentStatus {
    Pending = "pending",
    Success = "success",
    Refunded = "refunded",
    Failed = "failed"
}

enum PaymentMethod {
    Stripe = "stripe",
    Wallet = "wallet"
}

export interface PaymentEntity {
    id: string;
    payerId: string;
    payerType: PayerType;
    grossAmount: number;
    paidAmount: number;
    coupon: string | null;
    discount: number | null;
    status: PaymentStatus;
    method: PaymentMethod;
    reason:PaymentReason;
    enrollmentId:string|null
    transactionId: string|null;
    paidAt: Date|null;
    refundedAt: Date | null;
    createdAt:Date
}

export class PaymentRepositoryImpl implements IPaymentRepository {
    async create(data: Partial<PaymentEntity>): Promise<PaymentEntity | null> {
        const created = await PaymentModel.create(data);
        return created ? PaymentMapper.toDomain(created) : null;
    }

    async findOne(filter: Partial<PaymentEntity>): Promise<PaymentEntity | null> {
        const result = await PaymentModel.findOne(filter).exec();
        return result ? PaymentMapper.toDomain(result) : null;
    }

    async findById(id: string): Promise<Payment | null> {
        const result = await PaymentModel.findById(id).lean();
        return result ? PaymentMapper.toDomain(result) : null;
    }

    async findMany(filter: Partial<PaymentEntity>): Promise<PaymentEntity[]> {
        const results = await PaymentModel.find(filter).exec();
        return results.map(r => PaymentMapper.toDomain(r));
    }

    async update(id: string, updates: Partial<PaymentEntity>): Promise<PaymentEntity | null> {
        const updated = await PaymentModel.findByIdAndUpdate(id, updates, { new: true }).exec();
        return updated ? PaymentMapper.toDomain(updated) : null;
    }

    async delete(id: string): Promise<void> {
        await PaymentModel.findByIdAndDelete(id).exec();
    }
}
