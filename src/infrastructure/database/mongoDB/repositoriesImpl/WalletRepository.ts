import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { WalletModel } from "../models/WalletModel";
import { WalletMapper } from "../mappers/WalletMapper";

export interface WalletEntity{
    id:string;
    balance:number;
    learnerId:string;
}

export class WalletRepositoryImpl implements IWalletRepository {
  async create(learnerId: string): Promise<WalletEntity|null> {
    const wallet = await WalletModel.create({
      learnerId,
      balance: 0,
    });
    return wallet?WalletMapper.toDomain(wallet):null
  }

  async findByLearnerId(learnerId: string): Promise<WalletEntity | null> {
    const wallet = await WalletModel.findOne({ learnerId }).exec();
    return wallet?WalletMapper.toDomain(wallet):null;
  }

  async updateBalance(learnerId: string, newBalance: number): Promise<WalletEntity | null> {
    const wallet = await WalletModel.findOneAndUpdate(
      { learnerId },
      { balance: newBalance },
      { new: true }
    );
    return wallet?WalletMapper.toDomain(wallet):null;
  }
}
