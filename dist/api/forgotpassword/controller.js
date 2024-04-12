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
const logger_1 = __importDefault(require("../../utils/logger"));
const heplers_1 = require("../../utils/heplers");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const mailer_1 = __importDefault(require("../../utils/mailer"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            logger_1.default.warn(`[/forgotpassword/resetpassword] - data missing`);
            logger_1.default.debug(`[/forgotpassword/resetpassword]- email:${email}`);
            return res.status(400).json({
                error: "Please provide all the required fields",
            });
        }
        if (!(0, heplers_1.isValidEmail)(email)) {
            logger_1.default.warn(`[/forgotpassword/resetpassword] - invalid email`);
            logger_1.default.debug(`[/forgotpassword/resetpassword]-email:${email}`);
            return res.status(400).json({
                error: "Please provide a valid email"
            });
        }
        const userExist = yield prisma_1.default.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!userExist) {
            logger_1.default.warn(`[/forgotpassword/resetpassword] - user is not found`);
            logger_1.default.debug(`[/forgotpassword/resetpassword] - email:${email}`);
            return res.status(400).json({
                error: "User is not found",
            });
        }
        let otp = otp_generator_1.default.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        let Existotp = yield prisma_1.default.OTP.findUnique({ where: { otp: otp } });
        while (Existotp) {
            otp = otp_generator_1.default.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            Existotp = yield prisma_1.default.OTP.findUnique({ where: { otp: otp } });
        }
        yield mailer_1.default.sendverifyotp(email, otp);
        const otppayload = yield prisma_1.default.OTP.create({ data: { email, otp } });
        logger_1.default.info(`[/forgotpassword/resetpassword - success]`);
        logger_1.default.debug(`[/forgotpassword/resetpassword - email:${email} , otp:${otp}]`);
        res.status(200).json({
            message: "OTP sent successfully",
        });
    }
    catch (err) {
        logger_1.default.warn([`/forgotpassword/resetpassword- ${err.message}`]);
        return res.status(400).json({
            error: "Somthing went rong",
        });
    }
});
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        if (!otp) {
            logger_1.default.warn(`/forgotpassword/verify - data missing`);
            logger_1.default.debug(`/forgotpassword/verify - otp :${otp}`);
            return res.status(400).json({
                error: "please Enter Provide all details"
            });
        }
        let otpValue = otp;
        const existingOTP = yield prisma_1.default.OTP.findUnique({
            where: {
                otp: otpValue
            }
        });
        if (!existingOTP) {
            logger_1.default.warn(`/forgotpassword/verify - OTP not found`);
            return res.status(400).json({
                error: "Invalid OTP"
            });
        }
        res.status(200).json({
            message: "OTP verified successfully"
        });
    }
    catch (err) {
        logger_1.default.warn([`/forgotpassword/verify- ${err.message}`]);
        return res.status(400).json({
            error: "somthing went wrong"
        });
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPassword, confirmPassword, email } = req.body;
        if (!newPassword || !confirmPassword) {
            logger_1.default.warn(`/forgotpassword/changepassword - data missing`);
            logger_1.default.debug(`/forgotpassword/changepassword - newPassword:${newPassword} , confirmpassowrd:${confirmPassword}`);
            return res.status(400).json({
                error: "please Enter Provide all details"
            });
        }
        if (newPassword !== confirmPassword) {
            logger_1.default.warn(`/forgotpassword/changepassword - password dose not matched`);
            return res.status(400).json({
                error: "password does not matched"
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        yield prisma_1.default.users.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword
            }
        });
        res.status(200).json({
            success: true,
            message: "Password Change Successfully!"
        });
    }
    catch (err) {
        logger_1.default.warn([`/forgotpassword/changepassword- ${err.message}`]);
        return res.status(400).json({
            error: "somthing went wrong while reset password"
        });
    }
});
exports.default = { resetPassword, verify, changePassword };
//# sourceMappingURL=controller.js.map