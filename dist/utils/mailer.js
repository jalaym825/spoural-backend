"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
class Mailer {
    constructor() {
        this.from = process.env.GMAIL;
        this.transporter = nodemailer_1.default.createTransport({
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
    sendMail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.transporter.sendMail(Object.assign({ from: { name: "Spoural 2K24", address: 'jalay217@gmail.com' }, to: to, subject: subject }, body));
        });
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
    sendAppliedMail(email, teamName, verified) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = {
                    html: `<p>You have applied to the <strong>${teamName.toUpperCase()}</strong>. Please wait for the team owner to send further selection details.</p>`,
                };
                yield this.sendMail([email], 'Applied for the team', body);
            }
            catch (error) {
                logger_1.default.error(`[/team/player] - ${error.message}`);
            }
        });
    }
    sendSelectionMail(emails, teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = {
                    html: `<p>Congratulations 🥳!!!\n\n You have been selected in the <strong>${teamName.toUpperCase()}</strong>.</p>`,
                };
                yield this.sendMail(emails, 'Selected in team', body);
            }
            catch (error) {
                logger_1.default.error(`[/team/player] - ${error.message}`);
            }
        });
    }
    sendverifyotp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = {
                    html: `<p>Recet password email.your otp is <strong>${otp}</strong>.`
                };
                yield this.sendMail([email], 'verify Otp', body);
            }
            catch (error) {
                logger_1.default.error(`[/forgotpassword/resetpassword]-Something went wrong`);
            }
        });
    }
}
exports.default = new Mailer();
//# sourceMappingURL=mailer.js.map