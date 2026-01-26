import { IGetDownloadUrlUseCase } from "@application/IUseCases/shared/IGetDownloadUrl";
import { IFileStorageService } from "@domain/interfaces/IFileStorageService";

export class GetDownloadUrlUseCase implements IGetDownloadUrlUseCase{
    constructor(
        private readonly _s3Service: IFileStorageService
    ) { }

    async execute(key: string): Promise<string> {
        return this._s3Service.getViewURL(key);
    }
}
