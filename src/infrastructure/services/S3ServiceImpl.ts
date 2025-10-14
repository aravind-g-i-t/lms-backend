import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IS3Service } from "../../domain/interfaces/IS3Service";

export class S3ServiceImpl implements IS3Service {
    private s3: S3Client;
    private bucketName: string;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        this.bucketName = process.env.S3_BUCKET_NAME!;
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

        const url = await getSignedUrl(this.s3, command, { expiresIn: 60 });
        return { url, key };
    }

    async getDownloadUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        const url = await getSignedUrl(this.s3, command, { expiresIn: 300 });
        return url;
    }
}
