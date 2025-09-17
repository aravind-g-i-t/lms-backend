
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { GetLearnersInput, GetLearnersOutput } from "./types";



export class GetLearnersUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}

    async execute(input:GetLearnersInput):Promise<GetLearnersOutput>{
        const result=await this._learnerRepository.findAll(input);
        
        const {learners,totalPages,totalCount}=result;
        
        return {learners,totalPages,totalCount}
    }
}