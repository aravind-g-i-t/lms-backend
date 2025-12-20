import { WalletTransactionDoc } from "../models/WalletTxnModel";
import { WalletTransactionEntity } from "../repositoriesImpl/WalletTxnRepository";



export class WalletTxnMapper {
    static toDomain(doc: WalletTransactionDoc): WalletTransactionEntity {

        return {
            id: doc._id.toString(),
            learnerId:doc.learnerId.toString(),
            walletId:doc.walletId.toString(),
            type:doc.type,
            amount:doc.amount,
            reason:doc.reason,
            relatedEnrollmentId:doc.relatedEnrollmentId?doc.relatedEnrollmentId.toString():null,
            relatedPaymentId:doc.relatedPaymentId?doc.relatedPaymentId.toString():null,
            createdAt:doc.createdAt
        };
    }

}
