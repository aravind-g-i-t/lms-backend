import { Wallet } from "@domain/entities/Wallet";
import { WalletDoc } from "../models/WalletModel";


export class WalletMapper {
    static toDomain(doc: WalletDoc): Wallet {

        return {
            id: doc._id.toString(),
            learnerId:doc.learnerId.toString(),
            balance:doc.balance
        };
    }


}
