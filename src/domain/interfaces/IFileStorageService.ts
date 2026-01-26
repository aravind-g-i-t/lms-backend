import { Response } from "express";

export interface IFileStorageService {
    getUploadUrl(
        key: string,
        contentType: string
    ): Promise<{ url: string; key: string }>;

    getViewURL(key: string): Promise<string>;

    getDownloadURL(key: string, filename: string): Promise<string>

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
