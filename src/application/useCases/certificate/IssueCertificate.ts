import { IssueCertificateInput } from "@application/dtos/certificate/IssueCertificate";
import { IIssueCertificateUseCase } from "@application/IUseCases/certificate/IIssueCertificate";
import { ICertificateRepository } from "@domain/interfaces/ICertificateRepository";
import { ICertificateTemplateService } from "@domain/interfaces/ICertificateService";
import { IPdfGeneratorService } from "@domain/interfaces/IPdfGeneratorService";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";



export class IssueCertificateUseCase implements IIssueCertificateUseCase{
    constructor(
        private _certificateRepository: ICertificateRepository,
        private _templateService: ICertificateTemplateService,
        private _pdfService: IPdfGeneratorService,
        private _storageService: IS3Service
    ) {}

    async execute(input: IssueCertificateInput): Promise<string> {
        const { learnerId, learnerName, courseId, courseTitle, grade ,enrollmentId,quizAttemptId,instructorName} = input;

        const serialNumber = `CERT-${courseId}-${Date.now()}`;

        const issueDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const html = this._templateService.generateHtml({
            learnerName,
            courseTitle,
            serialNumber,
            issueDate,
            grade: grade ?? null
        });

        const pdfBuffer = await this._pdfService.generateFromHtml(html);

        
        const fileKey = `certificates/${courseId}/${learnerId}/${serialNumber}.pdf`;

        await this._storageService.uploadBuffer(fileKey, pdfBuffer, {
            contentType: "application/pdf"
        });

        const certificate = await this._certificateRepository.create({
            learnerId,
            courseId,
            certificateNumber:serialNumber,
            issuedAt: new Date(),
            enrollmentId,
            quizAttemptId,
            certificateUrl:fileKey,
            grade,
            courseTitle,
            learnerName,
            instructorName
        });

        if(!certificate){
            throw new AppError("Failed to generate certificate",STATUS_CODES.BAD_REQUEST);
        }

        return certificate.id
    }
}
