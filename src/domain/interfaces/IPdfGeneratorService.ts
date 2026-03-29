export interface IPdfGeneratorService {
    generateCertificate(data: {
        learnerName: string;
        courseTitle: string;
        issueDate: string;
        serialNumber: string;
        instructorName: string;
        grade?: number | null;
    }): Promise<Buffer>
}
