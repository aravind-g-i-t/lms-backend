import { IInstructorApplyForVeficationUseCase } from "@application/IUseCases/instructor/IApplyForVerification";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { IInstructorVerificationRepository } from "@domain/interfaces/IInstructorVerificationRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class InstructorApplyForVeficationUseCase implements IInstructorApplyForVeficationUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository,
        private _instructorVerificationRepository:IInstructorVerificationRepository
    ){}

    async execute(id: string): Promise<void> {
        const instructor =await this._instructorRepository.findById(id);
        if(!instructor?.name|| !instructor.expertise.length||!instructor.designation|| !instructor.resume|| !instructor.website||!instructor.bio){
            throw new AppError(MESSAGES.INCOMPLETE_PROFILE,STATUS_CODES.BAD_REQUEST)
        }
        const application=await this._instructorVerificationRepository.create({
            instructorId:id,
            status:"Pending"
        })
        if(!application){
            throw new AppError(MESSAGES.SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}