import { Wallet } from "@domain/entities/Wallet";
import { IBaseRepository } from "./IBaseRepository";

export interface IWalletRepository extends IBaseRepository<Wallet> {
  updateBalance(learnerId: string, incrementBy: number): Promise<Wallet | null>;
}
