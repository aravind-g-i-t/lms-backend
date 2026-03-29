import { IPdfGeneratorService } from "@domain/interfaces/IPdfGeneratorService";
import PDFDocument from "pdfkit";


export class PdfGeneratorService implements IPdfGeneratorService {


    async generateCertificate(data: {
        learnerName: string;
        courseTitle: string;
        issueDate: string;
        serialNumber: string;
        instructorName: string;
        grade?: number | null;
    }): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
            const chunks: Buffer[] = [];

            doc.on("data", chunk => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            const W = 841.89;
            const H = 595.28;

            // Background
            doc.rect(0, 0, W, H).fill("#ffffff");

            // Outer border
            doc.rect(20, 20, W - 40, H - 40)
                .lineWidth(2)
                .strokeColor("#0d9488")
                .stroke();

            // Inner border
            doc.rect(28, 28, W - 56, H - 56)
                .lineWidth(0.5)
                .strokeColor("#0d9488")
                .stroke();

            // Corner ornaments
            const ornSize = 60;
            // Top-left
            doc.moveTo(20, 20 + ornSize).lineTo(20, 20).lineTo(20 + ornSize, 20)
                .lineWidth(2).strokeColor("#0d9488").stroke();
            // Bottom-right
            doc.moveTo(W - 20, H - 20 - ornSize).lineTo(W - 20, H - 20).lineTo(W - 20 - ornSize, H - 20)
                .lineWidth(2).strokeColor("#0d9488").stroke();

            // Title
            doc.font("Helvetica-Bold")
                .fontSize(48)
                .fillColor("#1a1a1a")
                .text("Certificate", 0, 60, { align: "center" });

            doc.font("Helvetica")
                .fontSize(13)
                .fillColor("#666666")
                .text("OF ACHIEVEMENT", 0, 118, { align: "center", characterSpacing: 4 });

            // Divider
            const cx = W / 2;
            doc.moveTo(cx - 50, 145).lineTo(cx + 50, 145)
                .lineWidth(1.5).strokeColor("#0d9488").stroke();

            // "This is to certify that"
            doc.font("Helvetica")
                .fontSize(12)
                .fillColor("#666666")
                .text("This is to certify that", 0, 162, { align: "center", characterSpacing: 2 });

            // Learner name
            doc.font("Helvetica-Bold")
                .fontSize(38)
                .fillColor("#0d9488")
                .text(data.learnerName, 60, 185, { align: "center" });

            // Underline below name
            doc.fontSize(38);
            const nameWidth = Math.min(doc.widthOfString(data.learnerName) + 40, 400);

            doc.moveTo(cx - nameWidth / 2, 232)
                .lineTo(cx + nameWidth / 2, 232)
                .lineWidth(1).strokeColor("#e5e5e5").stroke();

            // Achievement text
            doc.font("Helvetica")
                .fontSize(11)
                .fillColor("#444444")
                .text(
                    "has successfully completed the requirements and demonstrated",
                    60, 244, { align: "center" }
                )
                .text("exceptional proficiency in the course", 60, 260, { align: "center" });

            // Course title
            doc.font("Helvetica-BoldOblique")
                .fontSize(22)
                .fillColor("#1a1a1a")
                .text(`"${data.courseTitle}"`, 60, 278, { align: "center" });

            // Grade box
            if (data.grade != null) {
                const boxW = 120, boxH = 48;
                const boxX = cx - boxW / 2;
                const boxY = 312;
                doc.rect(boxX, boxY, boxW, boxH)
                    .fillColor("#f0fdfa")
                    .fill();
                doc.rect(boxX, boxY, 4, boxH)
                    .fillColor("#0d9488")
                    .fill();
                doc.font("Helvetica")
                    .fontSize(9)
                    .fillColor("#666666")
                    .text("FINAL GRADE", boxX + 12, boxY + 10, { width: boxW });
                doc.font("Helvetica-Bold")
                    .fontSize(22)
                    .fillColor("#0d9488")
                    .text(`${data.grade}%`, boxX + 12, boxY + 22, { width: boxW });
            }

            // Divider
            doc.moveTo(cx - 50, 376).lineTo(cx + 50, 376)
                .lineWidth(1.5).strokeColor("#0d9488").stroke();

            // Footer: Date | Seal | Instructor
            // Date
            doc.moveTo(120, 420).lineTo(260, 420)
                .lineWidth(0.5).strokeColor("#333333").stroke();
            doc.font("Helvetica")
                .fontSize(9)
                .fillColor("#666666")
                .text("DATE OF ISSUE", 120, 425, { width: 140, align: "center", characterSpacing: 1 });
            doc.font("Helvetica-Bold")
                .fontSize(11)
                .fillColor("#333333")
                .text(data.issueDate, 120, 440, { width: 140, align: "center" });

            // Seal (circle)
            doc.circle(cx, 415, 44)
                .lineWidth(2)
                .strokeColor("#0d9488")
                .stroke();
            doc.circle(cx, 415, 38)
                .lineWidth(0.5)
                .strokeColor("#0d9488")
                .stroke();
            doc.font("Helvetica-Bold")
                .fontSize(9)
                .fillColor("#0d9488")
                .text("OFFICIAL", cx - 20, 407, { width: 40, align: "center" })
                .text("SEAL", cx - 20, 418, { width: 40, align: "center" });

            // Instructor signature
            doc.moveTo(580, 420).lineTo(720, 420)
                .lineWidth(0.5).strokeColor("#333333").stroke();
            doc.font("Helvetica")
                .fontSize(9)
                .fillColor("#666666")
                .text("AUTHORIZED SIGNATURE", 580, 425, { width: 140, align: "center", characterSpacing: 1 });
            doc.font("Helvetica-Bold")
                .fontSize(11)
                .fillColor("#333333")
                .text(data.instructorName, 580, 440, { width: 140, align: "center" });

            // Serial number
            doc.font("Helvetica")
                .fontSize(8)
                .fillColor("#999999")
                .text(`No. ${data.serialNumber}`, W - 220, H - 42, { width: 180, align: "right" });

            doc.end();
        });
    }
}