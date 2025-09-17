import { ICacheService } from "@domain/interfaces/ICacheService";
import { IOTPService } from "@domain/interfaces/IOTPService";
import nodemailer from 'nodemailer';

export class OTPService implements IOTPService {
    constructor(
        private cacheService: ICacheService
    ) { }

    async generateOTP(): Promise<string> {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    async sendOTP(email: string, otp: string): Promise<Date> {
        const cacheKey = `otp:${email}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NLIGHTN_EMAIL,
                pass: process.env.NLIGHTN_EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.NLIGHTN_EMAIL,
            to: email,
            subject: 'Welcome to NlightN',
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>Thank you for using <strong>NlightN</strong>.</p>
          <p>Your OTP is:</p>
          <p style="font-size: 1.5rem; font-weight: bold; color: red;">${otp}</p>
          <p>Please do not share it with anyone.</p>
          <p>If you did not request this code, please contact our support team immediately.</p>
          <p>Best regards,<br>NlightN Team</p>
        </div>
      `,
        };
        try {
            await transporter.sendMail(mailOptions);
            await this.cacheService.set(cacheKey, otp, 120);
            return new Date(Date.now()+2*60*1000)
        } catch (error) {
            console.error('Failed to send email:', error)
            throw new Error("Failed to send OTP. Please try again.")
        }
    }

    async deleteOTP(email: string): Promise<void> {
        const cacheKey=`otp:${email}`;
        try { 
            await this.cacheService.delete(cacheKey)
        } catch (error) {   
            console.error(`Failed to delete OTP for ${email}`,error);
            throw new Error(`Failed to delete OTP for ${email}`)
        }
    }
}