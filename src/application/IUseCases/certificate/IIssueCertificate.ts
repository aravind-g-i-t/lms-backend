import { IssueCertificateInput } from "@application/dtos/certificate/IssueCertificate";

export interface IIssueCertificateUseCase{
    execute(input: IssueCertificateInput): Promise<string>
}