import { EarningStatus } from "@domain/entities/InstructorEarning";
import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";

export class ReleaseInstructorEarningsUseCase{
    constructor(
        private _instructorWalletRepo:IInstructorWalletRepository,
        private _instructorEarningsRepo:IInstructorEarningsRepository
    ){}

    async execute():Promise<void>{
        const now = new Date();

        const earningsToRelease= await this._instructorEarningsRepo.findPending(now);

        for(const earning of earningsToRelease){
            await this._instructorWalletRepo.updateBalance({
                instructorId:earning.instructorId,
                availableBalance:earning.amount,
                pendingBalance:0-earning.amount
            })
            await this._instructorEarningsRepo.updateById(
                earning.id,
                {
                    status:EarningStatus.Released
                }
            )
        };
    }
}