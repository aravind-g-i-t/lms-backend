import { InstructorWallet } from "@domain/entities/InstructorWallet";
import { InstructorWalletDoc } from "../models/InstructorWalletModel";
import { Types } from "mongoose";



export class InstructorWalletMapper {
    static toDomain(doc: InstructorWalletDoc): InstructorWallet {
        return {
            id: doc._id.toString(),
            instructorId:doc.instructorId.toString(),
            pendingBalance:doc.pendingBalance,
            availableBalance:doc.availableBalance
        };
    }

    static toPersistence(entity: Partial<InstructorWallet>): Partial<InstructorWalletDoc> {
        const data: Partial<InstructorWalletDoc> = {};

        if (entity.id !== undefined)
            data._id = new Types.ObjectId(entity.id);
        if (entity.instructorId !== undefined)
            data.instructorId = new Types.ObjectId(entity.instructorId);
        if (entity.pendingBalance !== undefined)
            data.pendingBalance = entity.pendingBalance;
        if (entity.availableBalance !== undefined)
            data.availableBalance = entity.availableBalance;
        return data;
    }
}
