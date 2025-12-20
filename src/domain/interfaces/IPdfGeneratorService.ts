export interface IPdfGeneratorService {
    generateFromHtml(html: string): Promise<Buffer>;
}
