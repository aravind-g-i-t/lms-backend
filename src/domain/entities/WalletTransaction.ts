export enum WalletTxnType {
  Credit = "credit",
  Debit = "debit"
}

export enum WalletTxnReason {
  CoursePurchase = "course_purchase",
  Refund = "refund",
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  learnerId: string;
  type: WalletTxnType;
  amount: number;
  reason: WalletTxnReason;
  relatedPaymentId: string|null;
  relatedEnrollmentId: string|null;
  createdAt: Date;
}
