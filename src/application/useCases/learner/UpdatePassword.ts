import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword, hashPassword } from "shared/utils/hash";

export class UpdateLearnerPasswordUseCase implements IUpdateUserPassword{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}
    async execute(id:string,currentPassword:string,newPassword:string):Promise<void>{
        
        const learner=await this._learnerRepository.findById(id,true);
        
        if(!learner?.password){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        const passwordMatch= await comparePassword(currentPassword,learner?.password);
        if(!passwordMatch){
            throw new AppError(MESSAGES.INCORRECT_PASSWORD,STATUS_CODES.UNAUTHORIZED)
        }
        const hashedPassword=await hashPassword(newPassword)
        await this._learnerRepository.findByIdAndUpdate(id,{password:hashedPassword})
    }
}