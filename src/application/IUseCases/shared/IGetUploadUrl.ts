export interface IGetUploadUrlUseCase {
  execute(params: {
    fileName: string;
    fileType: string;
    folder?: string;
  }): Promise<{ url: string; key: string }>;
}


