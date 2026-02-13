import { FindManyTransactionsOutput, IWalletTransactionRepository } from "@domain/interfaces/IWalletTxnRepository";
import { WalletTransactionModel } from "../models/WalletTxnModel";
import { WalletTxnMapper } from "../mappers/WalletTxnMapper";
import { BaseRepository } from "./BaseRepository";
import { WalletTransaction } from "@domain/entities/WalletTransaction";
import { EnrollmentDoc } from "../models/EnrollmentModel";






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

    async findManyByLearnerId({learnerId,page,limit}:{learnerId: string; page:number; limit:number}): Promise<FindManyTransactionsOutput> {
        const skip= (page - 1) * limit
        const [txns, totalCount] = await Promise.all([

            WalletTransactionModel.find({ learnerId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate<{enrollmentId:EnrollmentDoc}>("enrollmentId")
            .exec(),
            WalletTransactionModel.countDocuments({learnerId})
        ])
            return {
                transactions:txns.map((t) => WalletTxnMapper.toHydratedDomain(t)),
                totalCount,
                totalPages: Math.ceil(totalCount / limit) 
        }
    }
}
