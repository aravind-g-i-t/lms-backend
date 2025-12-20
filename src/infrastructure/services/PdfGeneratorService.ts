import { IPdfGeneratorService } from "@domain/interfaces/IPdfGeneratorService";
import puppeteer from "puppeteer";

export class PdfGeneratorService implements IPdfGeneratorService {
    async generateFromHtml(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true 
        });

        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfUint8 = await page.pdf({
            format: "A4",
            printBackground: true
        });

        await browser.close();

        return Buffer.from(pdfUint8);
    }
}
