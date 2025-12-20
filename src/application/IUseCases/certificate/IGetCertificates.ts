import { Certificate } from "@domain/entities/Certificate"

export interface IGetCertificatesForLearnerUseCase{
    execute(input: { page: number, limit: number, learnerId: string }): Promise<{
            certificates: Certificate[],
            totalPages: number,
            totalCount: number
        }>
}