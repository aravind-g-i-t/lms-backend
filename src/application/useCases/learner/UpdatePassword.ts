import { ILearnerRepository } from "@domain/interfaces/ILearnerRepository";
import { userAuthController } from "@setup/container/shared/userAuthController";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword, hashPassword } from "shared/utils/hash";

export class UpdateLearnerPasswordUseCase{
    constructor(
        private _learnerRepository:ILearnerRepository
    ){}
    async execute(id:string,currentPassword:string,newPassword:string){
        console.log(id,currentPassword,newPassword);
        
        const learner=await this._learnerRepository.findById(id);
        console.log('learner',learner);
        
        if(!learner?.password){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        const passwordMatch= await comparePassword(currentPassword,learner?.password);
        console.log('passwordMatch',passwordMatch);
        if(!passwordMatch){
            throw new AppError('Password mismatch.',STATUS_CODES.UNAUTHORIZED)
        }
        const hashedPassword=await hashPassword(newPassword)
        await this._learnerRepository.update(id,{password:hashedPassword})
    }
}