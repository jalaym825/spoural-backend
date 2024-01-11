import nodemailer from "nodemailer";

interface body {
    html: string;
    text: string;
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
}

export default Mailer;