import { IssueCertificateUseCase } from "@application/useCases/certificate/IssueCertificate";
import { CertificateRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/CertificateRepository";
import { CertificateTemplateService } from "@infrastructure/services/CertificateTemplateService ";
import { PdfGeneratorService } from "@infrastructure/services/PdfGeneratorService";
import { s3Service } from "../shared/s3Controller";


export const certificateTemplateService= new CertificateTemplateService()

export const pdfGeneratorService= new PdfGeneratorService()

export const certificateRepository= new CertificateRepository()

export const issueCertificateUseCase=new IssueCertificateUseCase(certificateRepository,certificateTemplateService,pdfGeneratorService,s3Service)