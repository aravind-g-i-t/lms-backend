export interface ICertificateTemplateService {
    generateHtml(input: {
        learnerName: string;
        courseTitle: string;
        issueDate: string;
        serialNumber: string;
        grade?: number | null;
    }): string;
}
