import { ICertificateTemplateService } from "@domain/interfaces/ICertificateService";

export class CertificateTemplateService implements ICertificateTemplateService {
  generateHtml(data: {
    learnerName: string;
    courseTitle: string;
    issueDate: string;
    serialNumber: string;
    grade?: number | null;
  }) {

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;600&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Montserrat', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }
          
          .certificate-container {
            background: #ffffff;
            width: 100%;
            max-width: 900px;
            padding: 60px;
            position: relative;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          
          .certificate-border {
            border: 3px solid #0d9488;
            padding: 50px;
            position: relative;
          }
          
          .certificate-border::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 1px solid #0d9488;
            pointer-events: none;
          }
          
          .ornament-top,
          .ornament-bottom {
            width: 80px;
            height: 80px;
            position: absolute;
            border: 2px solid #0d9488;
          }
          
          .ornament-top {
            top: -2px;
            left: -2px;
            border-right: none;
            border-bottom: none;
          }
          
          .ornament-bottom {
            bottom: -2px;
            right: -2px;
            border-left: none;
            border-top: none;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .certificate-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 52px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          
          .subtitle {
            font-size: 16px;
            color: #666;
            font-weight: 300;
            letter-spacing: 4px;
            text-transform: uppercase;
          }
          
          .divider {
            width: 100px;
            height: 2px;
            background: linear-gradient(to right, transparent, #0d9488, transparent);
            margin: 30px auto;
          }
          
          .recipient-section {
            text-align: center;
            margin: 40px 0;
          }
          
          .recipient-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
          }
          
          .recipient-name {
            font-family: 'Cormorant Garamond', serif;
            font-size: 48px;
            font-weight: 600;
            color: #0d9488;
            margin-bottom: 30px;
            line-height: 1.2;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 15px;
            display: inline-block;
            min-width: 400px;
          }
          
          .achievement-text {
            font-size: 16px;
            color: #444;
            line-height: 1.8;
            max-width: 600px;
            margin: 0 auto 20px;
          }
          
          .course-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 32px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 20px 0;
            font-style: italic;
          }
          
          .grade-section {
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
            border-left: 4px solid #0d9488;
            display: inline-block;
          }
          
          .grade-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          
          .grade-value {
            font-family: 'Cormorant Garamond', serif;
            font-size: 36px;
            font-weight: 700;
            color: #0d9488;
          }
          
          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          
          .date-section,
          .signature-section {
            text-align: center;
            flex: 1;
          }
          
          .signature-line {
            width: 200px;
            height: 1px;
            background: #333;
            margin: 0 auto 10px;
          }
          
          .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .value {
            font-size: 14px;
            color: #333;
            font-weight: 600;
            margin-top: 5px;
          }
          
          .serial-number {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 10px;
            color: #999;
            letter-spacing: 1px;
          }
          
          .seal {
            position: absolute;
            bottom: 80px;
            right: 60px;
            width: 100px;
            height: 100px;
            border: 3px solid #0d9488;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle, #ffffff 0%, #f0fdfa 100%);
            transform: rotate(-15deg);
          }
          
          .seal-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 11px;
            font-weight: 700;
            color: #0d9488;
            text-align: center;
            line-height: 1.3;
            text-transform: uppercase;
          }
          
          @media print {
            body {
              background: white;
            }
            .certificate-container {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="certificate-border">
            <div class="ornament-top"></div>
            <div class="ornament-bottom"></div>
            
            <div class="header">
              <div class="certificate-title">Certificate</div>
              <div class="subtitle">of Achievement</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="recipient-section">
              <div class="recipient-label">This is to certify that</div>
              <div class="recipient-name">${data.learnerName}</div>
              
              <div class="achievement-text">
                has successfully completed the requirements and demonstrated
                exceptional proficiency in the course
              </div>
              
              <div class="course-title">"${data.courseTitle}"</div>
              
              ${data.grade ? `
                <div class="grade-section">
                  <div class="grade-label">Final Grade</div>
                  <div class="grade-value">${data.grade}%</div>
                </div>
              ` : ""}
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              <div class="date-section">
                <div class="signature-line"></div>
                <div class="label">Date of Issue</div>
                <div class="value">${data.issueDate}</div>
              </div>
              
              <div class="signature-section">
                <div class="signature-line"></div>
                <div class="label">Authorized Signature</div>
              </div>
            </div>
            
            <div class="seal">
              <div class="seal-text">Official<br/>Seal</div>
            </div>
            
            <div class="serial-number">No. ${data.serialNumber}</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}