import { IGetDownloadUrlUseCase } from "@application/IUseCases/shared/IGetDownloadUrl";
import { IGetUploadUrlUseCase } from "@application/IUseCases/shared/IGetUploadUrl";
import { Request, Response } from "express";


export class S3Controller {
    constructor(
        private readonly _getUploadUrlUseCase: IGetUploadUrlUseCase,
        private readonly _getDownloadURLUseCase: IGetDownloadUrlUseCase
    ) { }

    async getUploadUrl(req: Request, res: Response): Promise<void> {
        try {
            const { fileName, fileType, folder } = req.query as {
                fileName: string;
                fileType: string;
                folder?: string;
            };

            const result = await this._getUploadUrlUseCase.execute({
                fileName,
                fileType,
                folder,
            });

            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to generate upload URL" });
        }
    }

    async getViewURL(req: Request, res: Response): Promise<void> {
        try {
            const { key } = req.query as { key: string };

            const url = await this._getDownloadURLUseCase.execute(key);
            res.status(200).json({ url });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to generate download URL" });
        }
    }
}
