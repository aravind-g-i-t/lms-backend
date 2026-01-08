import { Response } from "express";

export interface IFileStorageService {
    getUploadUrl(
        key: string,
        contentType: string
    ): Promise<{ url: string; key: string }>;

    getDownloadUrl(key: string): Promise<string>;

    uploadBuffer(
        key: string,
        file: Buffer,
        options?: { contentType?: string }
    ): Promise<void>

    streamVideo(
        key: string,
        range: string,
        res: Response
    ): Promise<void>;

    deleteFile(key: string): Promise<void>

}
