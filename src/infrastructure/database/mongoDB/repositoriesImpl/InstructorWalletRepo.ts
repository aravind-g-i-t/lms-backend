import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { InstructorWalletModel } from "../models/InstructorWalletModel";
import { InstructorWalletMapper } from "../mappers/InstructorWalletMapper";
import { InstructorWallet } from "@domain/entities/InstructorWallet";
import { BaseRepository } from "./BaseRepository";



export class InstructorWalletRepositoryImpl extends BaseRepository<InstructorWallet> implements IInstructorWalletRepository
{
  constructor(){
    super(InstructorWalletModel,InstructorWalletMapper)
  }
  

  async findByInstructorId(
    instructorId: string
  ): Promise<InstructorWallet | null> {
    const doc = await InstructorWalletModel.findOne({ instructorId }).exec();
    return doc ? InstructorWalletMapper.toDomain(doc) : null;
  }

  async updateBalance(input: {
  instructorId: string;
  availableBalance?: number;
  pendingBalance?: number;
}): Promise<InstructorWallet | null> {

  const inc: Record<string, number> = {};

  if (input.availableBalance !== undefined) {
    inc.availableBalance = input.availableBalance;   // can be + or -
  }

  if (input.pendingBalance !== undefined) {
    inc.pendingBalance = input.pendingBalance;       // can be + or -
  }

  const wallet = await InstructorWalletModel.findOneAndUpdate(
    { instructorId: input.instructorId },
    { $inc: inc },
    { new: true }
  );

  return wallet ? InstructorWalletMapper.toDomain(wallet) : null;
}

}
