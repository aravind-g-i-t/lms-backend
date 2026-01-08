import { IWalletTransactionRepository } from "@domain/interfaces/IWalletTxnRepository";
import { WalletTransactionModel } from "../models/WalletTxnModel";
import { WalletTxnMapper } from "../mappers/WalletTxnMapper";
import { BaseRepository } from "./BaseRepository";
import { WalletTransaction } from "@domain/entities/WalletTransaction";






export class WalletTransactionRepositoryImpl extends BaseRepository<WalletTransaction>
    implements IWalletTransactionRepository {

    constructor(){
        super(WalletTransactionModel,WalletTxnMapper)
    }


    async findByWalletId(walletId: string): Promise<WalletTransaction[]> {
        const txns = await WalletTransactionModel.find({ walletId })
            .sort({ createdAt: -1 })
            .exec();
        return txns.map((t) => WalletTxnMapper.toDomain(t));
    }

    async findByLearnerId(learnerId: string): Promise<WalletTransaction[]> {
        const txns = await WalletTransactionModel.find({ learnerId })
            .sort({ createdAt: -1 })
            .exec();
        return txns.map((t) => WalletTxnMapper.toDomain(t));
    }
}
