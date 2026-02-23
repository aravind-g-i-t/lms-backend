import { Wallet } from "@domain/entities/Wallet";
import { WalletDoc } from "../models/WalletModel";
import { Types } from "mongoose";


export class WalletMapper {
    static toDomain(doc: WalletDoc): Wallet {

        return {
            id: doc._id.toString(),
            learnerId:doc.learnerId.toString(),
            balance:doc.balance
        };
    }

    static toPersistence(entity: Partial<Wallet>): Partial<WalletDoc> {

        const data: Partial<WalletDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.learnerId !== undefined)
            data.learnerId = new Types.ObjectId(entity.learnerId);
        if (entity.balance !== undefined)
            data.balance = entity.balance;

        return data;

    }
}
