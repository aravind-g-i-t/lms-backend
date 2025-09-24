
import { GetInstructorsInput, GetInstructorsOutput, IGetInstructorsUseCase } from "@application/IUseCases/instructor/IGetInstructors";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";




export class GetInstructorsUseCase implements IGetInstructorsUseCase {
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(input:GetInstructorsInput):Promise<GetInstructorsOutput>{
        const result=await this._instructorRepository.findAll(input);
        
        const {instructors,totalPages,totalCount}=result;
        
        return {instructors,totalPages,totalCount}
    }
}