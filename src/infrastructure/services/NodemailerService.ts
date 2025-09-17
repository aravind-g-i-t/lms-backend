import { IEmailService } from '@domain/interfaces/IEmailService';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
const env=process.env.NODE_ENV || 'production'
dotenv.config({path: `.env.${env}`});

const nlightnEmail=process.env.NLIGHTN_EMAIL;
const nlightnPassword=process.env.NLIGHTN_EMAIL_PASS;

export class NodemailerService implements IEmailService{
    constructor(
        private transporter=nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: nlightnEmail,
                        pass: nlightnPassword,
                    },
                })
    ){}

    async send(email:string,subject:string,text:string):Promise<void>{
        try {
            console.log('hostMail:',nlightnEmail);
            
            const mailOptions={
                from:nlightnEmail,
                to:email,
                subject,
                text
            }
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.log('Failed to send otp:',error)
        }
    }
}