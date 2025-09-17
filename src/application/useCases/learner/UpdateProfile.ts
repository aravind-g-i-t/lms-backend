import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateLearnerProfileUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}

    async execute(id:string,{name,imageURL}:{name:string,imageURL:string}){
        console.log('id',id,'name',name,imageURL);
        
        const learner=await this._learnerRepository.update(id,{name,profilePic:imageURL});
        if(!learner){
            throw new AppError(MESSAGES.LEARNER_NOT_FOUND,200,false);
        }
        console.log(learner);
        
        return learner;
    }
}