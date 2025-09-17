import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";

export class UpdateLearnerStatusUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}

    async execute(id:string){
        console.log(id);
        
        await this._learnerRepository.updateStatus(id)
    }
}