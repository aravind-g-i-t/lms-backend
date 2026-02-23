import { Enrollment } from "@domain/entities/Enrollment";
import { TransactionReason, TransactionType, WalletTransaction } from "@domain/entities/WalletTransaction";
import { IBaseRepository } from "./IBaseRepository";

export interface HydratedWalletTransaction {
    id: string;
    walletId: string;
    learnerId: string;
    type: TransactionType;
    amount: number;
    reason: TransactionReason;
    enrollmentId: Enrollment | null;
    createdAt: Date;
}

export interface FindManyTransactionsOutput {
    transactions: HydratedWalletTransaction[],
    totalCount: number,
    totalPages: number
}

export interface IWalletTransactionRepository extends IBaseRepository<WalletTransaction> {
    findByWalletId(walletId: string): Promise<WalletTransaction[]>;
    findManyByLearnerId({ learnerId, page, limit }: { learnerId: string; page: number; limit: number }): Promise<FindManyTransactionsOutput>
}
