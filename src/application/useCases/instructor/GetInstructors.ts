
import { GetInstructorsInput, GetInstructorsOutput, IGetInstructorsUseCase } from "@application/IUseCases/instructor/IGetInstructors";
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
        console.log("useCase input:",input);
        
        
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
        
        const {instructors,totalPages,totalCount}=result;
        
        return {instructors,totalPages,totalCount}
    }
}