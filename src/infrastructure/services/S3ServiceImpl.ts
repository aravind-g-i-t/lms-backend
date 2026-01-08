import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IFileStorageService } from "../../domain/interfaces/IFileStorageService";
import { Response } from "express";
import { Readable } from "stream";


export class S3ServiceImpl implements IFileStorageService {
    private s3: S3Client;
    private bucketName: string;
    private uploadUrlExpiry: number;
    private downloadUrlExpiry: number;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        this.bucketName = process.env.S3_BUCKET_NAME!;
        this.uploadUrlExpiry = Number(process.env.S3_UPLOAD_URL_EXPIRY) || 60;
        this.downloadUrlExpiry = Number(process.env.S3_DOWNLOAD_URL_EXPIRY) || 10;
    }

    async getUploadUrl(
        key: string,
        contentType: string
    ): Promise<{ url: string; key: string }> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(this.s3, command, { expiresIn: this.uploadUrlExpiry });
        return { url, key };
    }

    async getDownloadUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        const url = await getSignedUrl(this.s3, command, { expiresIn: this.downloadUrlExpiry });
        return url;
    }

    async uploadBuffer(
        key: string,
        file: Buffer,
        options?: { contentType?: string }
    ): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: options?.contentType || "application/octet-stream"
        });

        await this.s3.send(command);
    }

    async streamVideo(key: string, range: string, res: Response) {
        const head = await this.s3.send(
            new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key
            })
        );

        const videoSize = Number(head.ContentLength);
        const CHUNK_SIZE = 10 ** 6; // 1MB

        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Range: `bytes=${start}-${end}`
        });

        const s3Response = await this.s3.send(command);

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": head.ContentType || "video/mp4"
        });

        const stream = s3Response.Body as Readable;
        stream.pipe(res);
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        await this.s3.send(command);
    }

}
