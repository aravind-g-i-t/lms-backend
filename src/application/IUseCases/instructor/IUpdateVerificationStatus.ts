import { UpdateVerificationStatusInputDTO } from "@application/dtos/shared/UpdateVerificationStatus";

export interface IUpdateInstructorVerificationStatusUseCase{
    execute(input:UpdateVerificationStatusInputDTO):Promise<void>;
}