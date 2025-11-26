import { WalletDoc } from "../models/WalletModel";
import { WalletEntity } from "../repositoriesImpl/WalletRepository";


export class WalletMapper {
    static toDomain(doc: WalletDoc): WalletEntity {

        return {
            id: doc._id.toString(),
            learnerId:doc.learnerId.toString(),
            balance:doc.balance
        };
    }


}
