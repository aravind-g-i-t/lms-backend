import { UpdateVerificationStatusInputDTO } from "@application/dtos/shared/UpdateVerificationStatus";

export interface IUpdateBusinessVerificationStatusUseCase{
    execute(input:UpdateVerificationStatusInputDTO):Promise<void>;
}