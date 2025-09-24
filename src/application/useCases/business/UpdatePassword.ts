import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IBusinessRepository } from "@domain/interfaces/IBusinessRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword, hashPassword } from "shared/utils/hash";

export class UpdateBusinessPasswordUseCase implements IUpdateUserPassword{
    constructor(
        private _businessRepository:IBusinessRepository
    ){}
    async execute(id:string,currentPassword:string,newPassword:string):Promise<void>{
        console.log(id,currentPassword,newPassword);
        
        const business=await this._businessRepository.findById(id,true);
        console.log('business',business);
        
        if(!business?.password){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        const passwordMatch= await comparePassword(currentPassword,business?.password);
        console.log('passwordMatch',passwordMatch);
        if(!passwordMatch){
            throw new AppError(MESSAGES.INCORRECT_PASSWORD,STATUS_CODES.UNAUTHORIZED)
        }
        const hashedPassword=await hashPassword(newPassword)
        await this._businessRepository.findByIdAndUpdate(id,{password:hashedPassword})
    }
}