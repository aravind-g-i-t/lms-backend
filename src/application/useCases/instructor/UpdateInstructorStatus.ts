import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";

export class UpdateInstructorStatusUseCase implements IUpdateUserStatusUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(id:string):Promise<void>{
        await this._instructorRepository.updateStatus(id)
    }
}