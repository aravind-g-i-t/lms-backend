
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { GetInstructorsInput, GetInstructorsOutput } from "./types";



export class GetInstructorsUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(input:GetInstructorsInput):Promise<GetInstructorsOutput>{
        const result=await this._instructorRepository.findAll(input);
        
        const {instructors,totalPages,totalCount}=result;
        
        return {instructors,totalPages,totalCount}
    }
}