import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";

export class UpdateBusinessStatusUseCase implements IUpdateUserStatusUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}

    async execute(id:string):Promise<void>{
        await this._businessRepository.updateStatus(id)
    }
}