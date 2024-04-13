import nodemailer from "nodemailer";
import logger from "./logger";
const config = require('../../config.json');

interface body {
    html?: string;
    text?: string;
}

class Mailer {
    from: string | undefined = config.GMAIL;
    transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: config.GMAIL,
                pass: config.GMAIL_KEY,
            },
        });
        this.sendMail = this.sendMail.bind(this);
    }

    public async sendMail(to: Array<string>, subject: string, body: body) {
        return await this.transporter.sendMail({
            from: { name: "Spoural 2K24", address: 'jalay217@gmail.com' }, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            ...body
        })
    }

    // public async sendAddedToTeamMail(email: string, teamName: string, verified: boolean) {
    //     try {
    //         const body = {
    //             html: `<p>You have been added to the <strong>${teamName}</strong>. Please login to your account to view the team.${verified ? '' : '<br>You will have to verify your email before you can login'}</p>`,
    //         }
    //         await this.sendMail([email], 'Added to team', body);
    //     } catch (error: any) {
    //         logger.error(`[/team/player] - ${error.message}`);
    //     }
    // }

    public async sendAppliedMail(email: string, teamName: string, verified: boolean) {
        try {
            const body = {
                html: `<p>You have applied to the <strong>${teamName.toUpperCase()}</strong>. Please wait for the team owner to send further selection details.</p>`,
            }
            await this.sendMail([email], 'Applied for the team', body);
        } catch (error: any) {
            logger.error(`[/team/player] - ${error.message}`);
        }
    }

    public async sendSelectionMail(emails: Array<string>, teamName: string) {
        try {
            const body = {
                html: `<p>Congratulations 🥳!!!\n\n You have been selected in the <strong>${teamName.toUpperCase()}</strong>.</p>`,
            }
            await this.sendMail(emails, 'Selected in team', body);
        } catch (error: any) {
            logger.error(`[/team/player] - ${error.message}`);
        }
    }


    public async sendverifyotp(email: string, otp: String) {
        try {
            const body = {
                html: `<p>Recet password email.your otp is <strong>${otp}</strong>.`
            }
            await this.sendMail([email], 'verify Otp', body);

        } catch (error) {
            logger.error(`[/forgotpassword/resetpassword]-Something went wrong`);
        }

    }


}

export default new Mailer();