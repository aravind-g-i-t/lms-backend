import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { WalletModel } from "../models/WalletModel";
import { WalletMapper } from "../mappers/WalletMapper";
import { BaseRepository } from "./BaseRepository";
import { Wallet } from "@domain/entities/Wallet";



export class WalletRepositoryImpl extends BaseRepository<Wallet> implements IWalletRepository {

  constructor(){
    super(WalletModel,WalletMapper)
  }

  async updateBalance(learnerId: string, newBalance: number): Promise<Wallet | null> {
    const wallet = await WalletModel.findOneAndUpdate(
      { learnerId },
      { balance: newBalance },
      { new: true }
    );
    return wallet?WalletMapper.toDomain(wallet):null;
  }
}
