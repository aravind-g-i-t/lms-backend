import { IFileStorageService } from "@domain/interfaces/IFileStorageService";

export class GetDownloadUrlUseCase {
    constructor(
        private readonly _s3Service: IFileStorageService
    ) { }

    async execute(key: string): Promise<string> {
        return this._s3Service.getDownloadUrl(key);
    }
}
