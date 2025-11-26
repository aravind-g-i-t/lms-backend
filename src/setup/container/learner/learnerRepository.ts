import { LearnerRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/LearnerRepository"
import { WalletRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/WalletRepository"

export const learnerRepository=new LearnerRepositoryImpl()

export const walletRepository = new WalletRepositoryImpl()