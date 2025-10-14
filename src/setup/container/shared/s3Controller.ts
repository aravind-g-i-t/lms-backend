import { GetDownloadUrlUseCase } from "@application/useCases/shared/GetDownloadUrl";
import { GetUploadUrlUseCase } from "@application/useCases/shared/GetUploadUrl";
import { S3ServiceImpl } from "@infrastructure/services/S3ServiceImpl";
import { S3Controller } from "@presentation/controllers/S3Controller";

export const s3Service=new S3ServiceImpl()
const getUploadUrlUseCase= new GetUploadUrlUseCase(s3Service);
const getDownloadUrlUseCase=new GetDownloadUrlUseCase(s3Service)

export const s3Controller=new S3Controller(getUploadUrlUseCase,getDownloadUrlUseCase);