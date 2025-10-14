import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IS3Service } from "../../domain/interfaces/IS3Service";

export class S3ServiceImpl implements IS3Service {
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
        this.downloadUrlExpiry = Number(process.env.S3_DOWNLOAD_URL_EXPIRY) || 300;
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
}
