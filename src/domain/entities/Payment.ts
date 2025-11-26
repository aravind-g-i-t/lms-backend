

export enum PayerType {
    Learner = "learner",
    Business = "business"
}

export enum PaymentReason {
    CourseEnrollment = "course_enrollment",
    PremiumSubscription = "premium_subscription"
}

export enum PaymentStatus {
    Pending = "pending",
    Success = "success",
    Refunded = "refunded",
    Failed = "failed"
}

export enum PaymentMethod {
    Stripe = "stripe",
    Wallet = "wallet"
}

export interface Payment {
    id: string;
    payerId: string;
    payerType: PayerType;
    grossAmount: number;
    paidAmount: number;
    coupon: string | null;
    reason:PaymentReason;
    enrollmentId:string|null;
    discount: number | null;
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId: string|null;
    paidAt: Date | null;
    refundedAt: Date | null;
    createdAt: Date
}