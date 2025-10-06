import { IInstructorApplyForVeficationUseCase } from "@application/IUseCases/instructor/IApplyForVerification";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class InstructorApplyForVeficationUseCase implements IInstructorApplyForVeficationUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}

    async execute(id: string): Promise<void> {
        const instructor =await this._instructorRepository.findById(id);
        if(!instructor?.name|| !instructor.expertise.length||!instructor.designation|| !instructor.resume|| !instructor.website||!instructor.bio||!instructor.identityProof){
            throw new AppError(MESSAGES.INCOMPLETE_PROFILE,STATUS_CODES.BAD_REQUEST)
        }
        const updated=await this._instructorRepository.findByIdAndUpdate(id,{verification:{
            status:"Under Review",
            remarks:null
        }})
        if(!updated){
            throw new AppError(MESSAGES.SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}