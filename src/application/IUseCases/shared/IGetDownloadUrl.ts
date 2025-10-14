

export interface IGetDownloadUrlUseCase {
   execute(key: string): Promise<string> 
}
