
import { UpdateVerificationStatusInputDTO } from "@application/dtos/shared/UpdateVerificationStatus";
import { IUpdateInstructorVerificationStatusUseCase } from "@application/IUseCases/instructor/IUpdateVerificationStatus";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class UpdateInstructorVerificationStatusUseCase implements IUpdateInstructorVerificationStatusUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(input: UpdateVerificationStatusInputDTO): Promise<void> {
        const {id,status,remarks}=input;
        const verification={
            status,
            remarks
        };
        const updatedInstructor=await this._instructorRepository.findByIdAndUpdate(id,{verification})
        if(!updatedInstructor){
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}