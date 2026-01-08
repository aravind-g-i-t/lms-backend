import { IGetUploadUrlUseCase } from "@application/IUseCases/shared/IGetUploadUrl";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";

export class GetUploadUrlUseCase implements IGetUploadUrlUseCase {
    constructor(
        private readonly s3Service: IFileStorageService
    ) { }

    async execute(params: {
            fileName: string;
            fileType: string;
            folder?: string;
        }): Promise<{ url: string; key: string }> {

        const { fileName, fileType, folder } = params;
        const key = `${folder || "uploads"}/${Date.now()}-${fileName}`;
        return this.s3Service.getUploadUrl(key, fileType);
    }
}
