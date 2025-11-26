import { WalletTransaction } from "@domain/entities/WalletTransaction";

export interface IWalletTransactionRepository {
  create(txn: Partial<WalletTransaction>): Promise<WalletTransaction|null>;
  findByWalletId(walletId: string): Promise<WalletTransaction[]>;
  findByLearnerId(learnerId: string): Promise<WalletTransaction[]>;
}
