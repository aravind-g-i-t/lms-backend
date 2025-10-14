export interface IS3Service {
    getUploadUrl(
        key: string,
        contentType: string
    ): Promise<{ url: string; key: string }>;

    getDownloadUrl(key: string): Promise<string>;
}
