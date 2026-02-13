import { WalletTransaction } from "@domain/entities/WalletTransaction";
import { HydratedWalletTransactionDoc, WalletTransactionDoc } from "../models/WalletTxnModel";
import { HydratedWalletTransaction } from "@domain/interfaces/IWalletTxnRepository";
import { EnrollmentMapper } from "./EnrollmentMapper";



export class WalletTxnMapper {
    static toDomain(doc: WalletTransactionDoc): WalletTransaction {

        return {
            id: doc._id.toString(),
            learnerId:doc.learnerId.toString(),
            walletId:doc.walletId.toString(),
            type:doc.type,
            reason:doc.reason,
            amount:doc.amount,
            enrollmentId:doc.enrollmentId?doc.enrollmentId.toString():null,
            createdAt:doc.createdAt
        };
    }

    static toHydratedDomain(doc: HydratedWalletTransactionDoc): HydratedWalletTransaction {

        return {
            id: doc._id.toString(),
            learnerId:doc.learnerId.toString(),
            walletId:doc.walletId.toString(),
            reason:doc.reason,
            type:doc.type,
            amount:doc.amount,
            enrollmentId:doc.enrollmentId?EnrollmentMapper.toDomain(doc.enrollmentId):null,
            createdAt:doc.createdAt
        };
    }

}
