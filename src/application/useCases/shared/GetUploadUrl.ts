import { IGetUploadUrlUseCase } from "@application/IUseCases/shared/IGetUploadUrl";
import { IS3Service } from "@domain/interfaces/IS3Service";

export class GetUploadUrlUseCase implements IGetUploadUrlUseCase {
    constructor(
        private readonly s3Service: IS3Service
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
