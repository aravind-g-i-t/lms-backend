import { IGetDownloadUrlUseCase } from "@application/IUseCases/shared/IGetDownloadUrl";
import { IGetUploadUrlUseCase } from "@application/IUseCases/shared/IGetUploadUrl";
import { Request, Response } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";


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

            res.status(STATUS_CODES.OK).json(result);
        } catch (err) {
            console.error(err);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Failed to generate upload URL" });
        }
    }

    async getViewURL(req: Request, res: Response): Promise<void> {
        try {
            const { key } = req.query as { key: string };

            const url = await this._getDownloadURLUseCase.execute(key);
            res.status(STATUS_CODES.OK).json({ url });
        } catch (err) {
            console.error(err);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: "Failed to generate download URL" });
        }
    }
}
