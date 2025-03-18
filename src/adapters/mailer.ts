import nodemailer from 'nodemailer';
import { logger } from '../utilities/logger';

const mailer_email = Bun.env.MAILER_EMAIL
const mailer_password = Bun.env.MAILER_PASSWORD

export const mailer = {
    SendEmail: async (subject: string, body: string, recipients: string[], cc: string[], attachments?: any) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: mailer_email,
                pass: mailer_password,
            },
        });

        let mailOptions = {
            from: mailer_email,
            to: recipients,
            cc: cc,
            subject: subject,
            html: body.replace(/\\/g, ""),
            attachments: attachments
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            logger.Info(info)
            return true
        } catch (error) {
            logger.Error(error)
            throw new Error("send mail file")
        }
    },

    SendEmailCtrl: async (ctx: any) => {
        const subject = ctx.body.subject
        const body = ctx.body.body
        const recipients = ctx.body.recipients
        const cc = ctx.body.cc
        await mailer.SendEmail(subject, body, recipients, cc)
    }
}