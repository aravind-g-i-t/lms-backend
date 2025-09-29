
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { GetLearnersInput, GetLearnersOutput, IGetLearnersUseCase } from "@application/IUseCases/learner/IGetLearners";
import { escapeRegExp } from "shared/utils/escapeRegExp";



export class GetLearnersUseCase implements IGetLearnersUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}

    async execute(input:GetLearnersInput):Promise<GetLearnersOutput>{
        const {page,search,status,limit,verificationStatus}=input;
                
                const query:any={};
                if(status){
                    query.isActive=status==="Active"
                }
                if(search?.trim()){
                    query.name={$regex:escapeRegExp(search.trim()).slice(0, 100), $options: "i"}
                }
                if(verificationStatus){
                    query["verification.status"]=verificationStatus
                }
                const result=await this._learnerRepository.findAll(query,{page,limit});
        
        const {learners,totalPages,totalCount}=result;
        
        return {learners,totalPages,totalCount}
    }
}