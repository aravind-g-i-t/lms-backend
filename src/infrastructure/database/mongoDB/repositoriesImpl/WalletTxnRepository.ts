import { IWalletTransactionRepository } from "@domain/interfaces/IWalletTxnRepository";
import { WalletTransactionModel } from "../models/WalletTxnModel";
import { WalletTxnMapper } from "../mappers/WalletTxnMapper";

enum WalletTxnType {
  Credit = "credit",
  Debit = "debit"
}

enum WalletTxnReason {
  CoursePurchase = "course_purchase",
  Refund = "refund",
}

export interface WalletTransactionEntity {
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



export class WalletTransactionRepositoryImpl
  implements IWalletTransactionRepository
{
  async create(txn: WalletTransactionEntity): Promise<WalletTransactionEntity|null> {
    const created = await WalletTransactionModel.create(txn);
    return created?WalletTxnMapper.toDomain(created):null;
  }

  async findByWalletId(walletId: string): Promise<WalletTransactionEntity[]> {
    const txns = await WalletTransactionModel.find({ walletId })
      .sort({ createdAt: -1 })
      .exec();
    return txns.map((t) => WalletTxnMapper.toDomain(t));
  }

  async findByLearnerId(learnerId: string): Promise<WalletTransactionEntity[]> {
    const txns = await WalletTransactionModel.find({ learnerId })
      .sort({ createdAt: -1 })
      .exec();
    return txns.map((t) => WalletTxnMapper.toDomain(t));
  }
}
