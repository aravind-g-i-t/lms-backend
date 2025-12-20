import { IGetCertificatesForLearnerUseCase } from "@application/IUseCases/certificate/IGetCertificates";
import { Certificate } from "@domain/entities/Certificate";
import { ICertificateRepository } from "@domain/interfaces/ICertificateRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";

export class GetCertificatesForLearnerUseCase implements IGetCertificatesForLearnerUseCase {
    constructor(
        private _certificateRepository: ICertificateRepository,
        private _cloudService: IS3Service
    ) { }

    async execute(input: { page: number, limit: number, learnerId: string }): Promise<{
        certificates: Certificate[],
        totalPages: number,
        totalCount: number
    }> {
        const { page, limit, learnerId } = input;
        const result = await this._certificateRepository.findAllByLearner({ learnerId, page, limit });
        console.log("result",result);
        
        const certificates = await Promise.all(
            result.certificates.map(async (cert) => {
                if (cert.certificateUrl) {
                    const certificateUrl = await this._cloudService.getDownloadUrl(cert.certificateUrl);
                    cert.certificateUrl = certificateUrl;
                }
                return cert;
            })
        );

        return {certificates,totalCount:result.totalCount,totalPages:result.totalPages}
    }
}