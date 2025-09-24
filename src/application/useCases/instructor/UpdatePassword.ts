import { IUpdateUserPassword } from "@application/IUseCases/shared/IUpdateUserPassword";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { comparePassword, hashPassword } from "shared/utils/hash";

export class UpdateInstructorPasswordUseCase implements IUpdateUserPassword{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}
    async execute(id:string,currentPassword:string,newPassword:string):Promise<void>{
        console.log(id,currentPassword,newPassword);
        
        const instructor=await this._instructorRepository.findById(id,true);
        console.log('instructor',instructor);
        
        if(!instructor?.password){
            throw new AppError(MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
        }
        const passwordMatch= await comparePassword(currentPassword,instructor?.password);
        console.log('passwordMatch',passwordMatch);
        if(!passwordMatch){
            throw new AppError(MESSAGES.INCORRECT_PASSWORD,STATUS_CODES.UNAUTHORIZED)
        }
        const hashedPassword=await hashPassword(newPassword)
        await this._instructorRepository.findByIdAndUpdate(id,{password:hashedPassword})
    }
}