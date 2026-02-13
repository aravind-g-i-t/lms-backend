import { Wallet } from "@domain/entities/Wallet";

export interface IWalletRepository {
  create(input:Partial<Wallet>): Promise<Wallet|null>;
  findOne(input:Partial<Wallet>): Promise<Wallet | null>;
  updateBalance(learnerId: string, incrementBy: number): Promise<Wallet | null>;
}
