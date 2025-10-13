
import { GetInstructorsInput, GetInstructorsOutput } from "@application/dtos/instructor/GetInstructors";
import {  IGetInstructorsUseCase } from "@application/IUseCases/instructor/IGetInstructors";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { escapeRegExp } from "shared/utils/escapeRegExp";

type InstructorQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
  "verification.status"?: string;
};


export class GetInstructorsUseCase implements IGetInstructorsUseCase {
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(input:GetInstructorsInput):Promise<GetInstructorsOutput>{
        const {page,search,status,limit,verificationStatus}=input;
        
        
        const query:InstructorQuery={};
        if(status){
            query.isActive=status==="Active"
        }
        if(search?.trim()){
            query.name={$regex:escapeRegExp(search.trim()).slice(0, 100), $options: "i"}
        }
        if(verificationStatus){
            query["verification.status"]=verificationStatus
        }
        const result=await this._instructorRepository.findAll(query,{page,limit});
        
        const {totalPages,totalCount}=result;

        const instructors=result.instructors.map(instructor=>InstructorDTOMapper.toGetInstructorsDTO(instructor));
        
        return {instructors,totalPages,totalCount}
    }
}