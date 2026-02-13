export enum TransactionType {
  Credit = "credit",
  Debit = "debit"
}

export enum TransactionReason {
  CoursePurchase = "course_purchase",
  Refund = "refund",
  Redeem="redeem"
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  learnerId: string;
  type: TransactionType;
  amount: number;
  reason: TransactionReason;
  enrollmentId: string|null;
  createdAt: Date;
}
