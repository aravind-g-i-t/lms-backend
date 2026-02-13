import { IUpdateUserStatusUseCase } from "@application/IUseCases/shared/IUpdateUserStatusUseCase";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateInstructorStatusUseCase implements IUpdateUserStatusUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(id:string):Promise<void>{
        console.log("entered usecase");
        
        const updated=await this._instructorRepository.updateStatus(id);
        if(!updated){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}