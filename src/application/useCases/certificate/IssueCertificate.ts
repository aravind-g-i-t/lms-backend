import { IssueCertificateInput } from "@application/dtos/certificate/IssueCertificate";
import { IIssueCertificateUseCase } from "@application/IUseCases/certificate/IIssueCertificate";
import { ICertificateRepository } from "@domain/interfaces/ICertificateRepository";
import { ICertificateTemplateService } from "@domain/interfaces/ICertificateService";
import { IPdfGeneratorService } from "@domain/interfaces/IPdfGeneratorService";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";
import { MESSAGES } from "shared/constants/messages";



export class IssueCertificateUseCase implements IIssueCertificateUseCase {
    constructor(
        private _certificateRepository: ICertificateRepository,
        private _pdfService: IPdfGeneratorService,
        private _storageService: IFileStorageService
    ) { }

    async execute(input: IssueCertificateInput): Promise<string> {
        const { learnerId, learnerName, courseId, courseTitle, grade, enrollmentId, quizAttemptId, instructorName } = input;



        const serialNumber = `CERT-${courseId}-${Date.now()}`;

        const issueDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });



        const pdfBuffer = await this._pdfService.generateCertificate({
            learnerName,
            courseTitle,
            serialNumber,
            issueDate,
            instructorName,
            grade: grade ?? null
        });



        const fileKey = `certificates/${courseId}/${learnerId}/${serialNumber}.pdf`;

        await this._storageService.uploadBuffer(fileKey, pdfBuffer, {
            contentType: "application/pdf"
        });

        const certificate = await this._certificateRepository.create({
            learnerId,
            courseId,
            certificateNumber: serialNumber,
            issuedAt: new Date(),
            enrollmentId,
            quizAttemptId,
            certificateUrl: fileKey,
            grade,
            courseTitle,
            learnerName,
            instructorName
        });


        if (!certificate) {
            throw new AppError(MESSAGES.SOMETHING_WENT_WRONG, STATUS_CODES.INTERNAL_SERVER_ERROR);
        }

        return certificate.id
    }
}
