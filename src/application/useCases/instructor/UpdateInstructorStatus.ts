import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";

export class UpdateInstructorStatusUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(id:string){
        await this._instructorRepository.updateStatus(id)
    }
}