import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { InstructorWalletModel } from "../models/InstructorWalletModel";
import { InstructorWalletMapper } from "../mappers/InstructorWalletMapper";
import { InstructorWallet } from "@domain/entities/InstructorWallet";



export class InstructorWalletRepositoryImpl
  implements IInstructorWalletRepository
{
  async create(instructorId: string): Promise<InstructorWallet | null> {
    const doc = await InstructorWalletModel.create({
      instructorId,
      pendingBalance: 0,
      availableBalance: 0,
      totalEarned: 0,
    });

    return doc ? InstructorWalletMapper.toDomain(doc) : null;
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
