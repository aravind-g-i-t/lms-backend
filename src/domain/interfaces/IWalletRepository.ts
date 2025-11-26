import { Wallet } from "@domain/entities/Wallet";

export interface IWalletRepository {
  create(learnerId: string): Promise<Wallet|null>;
  findByLearnerId(learnerId: string): Promise<Wallet | null>;
  updateBalance(learnerId: string, newBalance: number): Promise<Wallet | null>;
}
