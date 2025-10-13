import { GetInstructorDataOutputDTO } from "@application/dtos/instructor/GetInstructorData";
import { IGetInstructorDataUseCase } from "@application/IUseCases/instructor/IGetInstructorData";
import { InstructorDTOMapper } from "@application/mappers/InstructorMapper";
import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetInstructorDataUseCase implements IGetInstructorDataUseCase{
    constructor(
        private _instructorRepository:IInstructorRepository
    ){}


    async execute(id: string): Promise<GetInstructorDataOutputDTO> {
        const user=await this._instructorRepository.findById(id,true);
        if(!user){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        return InstructorDTOMapper.toGetInstructorProfile(user);
    }
}