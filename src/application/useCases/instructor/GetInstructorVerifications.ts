import { GetInstructorVefificationsOutput, GetInstructorVerificationsInput, IGetInstructorVerificationsUseCase } from "@application/IUseCases/instructor/IGetInstructorVerifications";
import { IInstructorVerificationRepository } from "@domain/interfaces/IInstructorVerificationRepository";

export class GetInstructorVerificationsUseCase implements IGetInstructorVerificationsUseCase{
    constructor(
        private _instructorVerificationRepository:IInstructorVerificationRepository
    ){}

    async execute(input: GetInstructorVerificationsInput): Promise<GetInstructorVefificationsOutput> {
        const result=await this._instructorVerificationRepository.findAll(input);
        
        const {instructorVerifications,totalPages,totalCount}=result;
        
        return {instructorVerifications,totalPages,totalCount}
    }
}