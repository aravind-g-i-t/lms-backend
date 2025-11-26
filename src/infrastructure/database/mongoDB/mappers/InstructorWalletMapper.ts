import { InstructorWallet } from "@domain/entities/InstructorWallet";
import { InstructorWalletDoc } from "../models/InstructorWalletModel";



export class InstructorWalletMapper {
    static toDomain(doc: InstructorWalletDoc): InstructorWallet {
        return {
            id: doc._id.toString(),
            instructorId:doc.instructorId.toString(),
            pendingBalance:doc.pendingBalance,
            availableBalance:doc.availableBalance
        };
    }
}
