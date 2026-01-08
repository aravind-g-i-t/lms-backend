import { InstructorWallet } from "@domain/entities/InstructorWallet";

export interface IInstructorWalletRepository {
  create(input:Partial<InstructorWallet>): Promise<InstructorWallet|null>;
  findByInstructorId(instructorId: string): Promise<InstructorWallet | null>;
  updateBalance(input: {
      instructorId: string;
      availableBalance?: number;
      pendingBalance?: number;
    }): Promise<InstructorWallet | null>
}
