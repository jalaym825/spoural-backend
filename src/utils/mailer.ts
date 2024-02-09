import nodemailer from "nodemailer";
import logger from "./logger";

interface body {
    html?: string;
    text?: string;
}

class Mailer {
    from: string | undefined = process.env.GMAIL;
    transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_KEY,
            },
        });
        this.sendMail = this.sendMail.bind(this);
    }

    public async sendMail(to: Array<string>, subject: string, body: body) {
        return await this.transporter.sendMail({
            from: { name: "Jalay Movaliya", address: 'jalay217@gmail.com' }, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            ...body
        })
    }

    public async sendAddedToTeamMail(email: string, teamName: string, verified: boolean) {
        try {
            const body = {
                html: `<p>You have been added to the <strong>${teamName}</strong>. Please login to your account to view the team.${verified ? '' : '<br>You will have to verify your email before you can login'}</p>`,
                // text: `You have been added to the team. Please login to your account to view the team.${verified ? '' : ' You will have to verify your email before you can login'}`
            }
            await this.sendMail([email], 'Added to team', body);
        } catch (error: any) {
            logger.error(`[/team/player] - ${error.message}`);
        }
    }

    public async sendAppliedMail(email: string, teamName: string) {
        try {
            const body = {
                html: `<p>You have applied to the <strong>${teamName}</strong>. Please wait for the team owner to send further selection details.</p>`,
                // text: `You have applied to the team. Please wait for the team owner to accept your application.`
            }
            await this.sendMail([email], 'Applied to team', body);
        } catch (error: any) {
            logger.error(`[/team/player] - ${error.message}`);
        }
    }
}

export default new Mailer();