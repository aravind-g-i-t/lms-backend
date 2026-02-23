import { WalletTransaction } from "@domain/entities/WalletTransaction";
import { HydratedWalletTransactionDoc, WalletTransactionDoc } from "../models/WalletTxnModel";
import { HydratedWalletTransaction } from "@domain/interfaces/IWalletTxnRepository";
import { EnrollmentMapper } from "./EnrollmentMapper";
import { Types } from "mongoose";



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

    static toPersistence(entity: Partial<WalletTransaction>): Partial<WalletTransactionDoc> {

        const data: Partial<WalletTransactionDoc> = {};
        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.walletId !== undefined)
            data.walletId = new Types.ObjectId(entity.walletId);
        if (entity.type !== undefined)
            data.type = entity.type;
        if (entity.reason !== undefined)
            data.reason = entity.reason;
        if (entity.amount !== undefined)
            data.amount = entity.amount;
        if (entity.enrollmentId !== undefined)
            data.enrollmentId =entity.enrollmentId? new Types.ObjectId(entity.enrollmentId):null;
        if (entity.createdAt !== undefined)
            data.createdAt = entity.createdAt;

        return data;
    }

}
