import { InstructorWallet } from "@domain/entities/InstructorWallet";
import { IBaseRepository } from "./IBaseRepository";

export interface IInstructorWalletRepository extends IBaseRepository<InstructorWallet> {

  findByInstructorId(instructorId: string): Promise<InstructorWallet | null>;
  updateBalance(input: {
      instructorId: string;
      availableBalance?: number;
      pendingBalance?: number;
    }): Promise<InstructorWallet | null>
}
