import { Enrollment } from "@domain/entities/Enrollment";
import { TransactionReason, TransactionType, WalletTransaction } from "@domain/entities/WalletTransaction";

export interface HydratedWalletTransaction {
    id: string;
    walletId: string;
    learnerId: string;
    type: TransactionType;
    amount: number;
    reason:TransactionReason;
    enrollmentId: Enrollment|null;
    createdAt: Date;
}

export interface FindManyTransactionsOutput{
  transactions:HydratedWalletTransaction[],
  totalCount:number,
  totalPages:number
}

export interface IWalletTransactionRepository {
  create(txn: Partial<WalletTransaction>): Promise<WalletTransaction|null>;
  findByWalletId(walletId: string): Promise<WalletTransaction[]>;
  findManyByLearnerId({learnerId,page,limit}:{learnerId: string; page:number; limit:number}): Promise<FindManyTransactionsOutput> 
}
