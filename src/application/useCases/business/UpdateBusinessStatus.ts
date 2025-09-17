import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";

export class UpdateBusinessStatusUseCase{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}

    async execute(id:string){
        await this._businessRepository.updateStatus(id)
    }
}