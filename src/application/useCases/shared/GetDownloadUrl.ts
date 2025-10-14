import { IS3Service } from "@domain/interfaces/IS3Service";

export class GetDownloadUrlUseCase {
    constructor(
        private readonly _s3Service: IS3Service
    ) { }

    async execute(key: string): Promise<string> {
        return this._s3Service.getDownloadUrl(key);
    }
}
