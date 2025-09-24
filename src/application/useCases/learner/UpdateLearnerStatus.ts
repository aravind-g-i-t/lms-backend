import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";

export class UpdateLearnerStatusUseCase implements IUpdateUserStatusUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}

    async execute(id:string):Promise<void>{
        await this._learnerRepository.updateStatus(id)
    }
}