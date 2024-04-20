import { Request, Response } from "express";
import logger from "../../utils/logger";
import { isValidEmail } from "../../utils/heplers";
import prisma from "../../utils/prisma";
import mailer from "../../utils/mailer";
import otpGenerator from 'otp-generator'
import bcrypt from 'bcrypt';

const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            logger.warn(`[/forgotpassword/resetpassword] - data missing`);
            logger.debug(`[/forgotpassword/resetpassword]- email:${email}`);
            return res.status(400).json({
                error: "Please provide all the required fields",
            });
        }

        if (!isValidEmail(email)) {
            logger.warn(`[/forgotpassword/resetpassword] - invalid email`);
            logger.debug(`[/forgotpassword/resetpassword]-email:${email}`);
            return res.status(400).json({
                error: "Please provide a valid email"
            })
        }

        const userExist = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!userExist) {
            logger.warn(`[/forgotpassword/resetpassword] - user is not found`);
            logger.debug(`[/forgotpassword/resetpassword] - email:${email}`);
            return res.status(400).json({
                error: "User is not found",
            });
        }

        let otp = otpGenerator.generate(4,
            {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

        let Existotp = await prisma.OTP.findUnique({ where: { otp: otp } });
        
        while (Existotp) {
            otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            Existotp = await prisma.OTP.findUnique({ where: { otp: otp } });
        }

        await mailer.sendverifyotp(email, otp);
        await prisma.OTP.create({ data: { email, otp } });

        logger.info(`[/forgotpassword/resetpassword - success]`)
        logger.debug(`[/forgotpassword/resetpassword - email:${email} , otp:${otp}]`);

        res.status(200).json({
            message: "OTP sent successfully",
        })

    } catch (err: any) {
        logger.warn([`/forgotpassword/resetpassword- ${err.message}`]);
        return res.status(400).json({
            error: "Somthing went rong",
        })
    }

}

const verify = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            logger.warn(`/forgotpassword/verify - data missing`)
            logger.debug(`/forgotpassword/verify - otp :${otp}`)
            return res.status(400).json({
                error: "please Enter Provide all details"
            });
        }

        let otpValue = otp;
        const existingOTP = await prisma.OTP.findUnique({
            where: {
                otp: otpValue
            }
        });


        if (!existingOTP) {
            logger.warn(`/forgotpassword/verify - OTP not found`);
            return res.status(400).json({
                error: "Invalid OTP"
            });
        }

        res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (err: any) {
        logger.warn([`/forgotpassword/verify- ${err.message}`]);
        return res.status(400).json({
            error: "somthing went wrong"
        })

    }
}

const changePassword = async (req: Request, res: Response) => {
    try {
        const { newPassword, confirmPassword, email } = req.body
        if (!newPassword || !confirmPassword) {
            logger.warn(`/forgotpassword/changepassword - data missing`)
            logger.debug(`/forgotpassword/changepassword - newPassword:${newPassword} , confirmpassowrd:${confirmPassword}`)
            return res.status(400).json({
                error: "please Enter Provide all details"
            })
        }

        if (newPassword !== confirmPassword) {
            logger.warn(`/forgotpassword/changepassword - password dose not matched`)
            return res.status(400).json({
                error: "password does not matched"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.users.update({
            where: {
                email: email,
            },
            data: {
                password: hashedPassword
            }
        })

        res.status(200).json({
            success: true,
            message: "Password Change Successfully!"
        })

    } catch (err: any) {
        logger.warn([`/forgotpassword/changepassword- ${err.message}`]);
        return res.status(400).json({
            error: "somthing went wrong while reset password"
        })
    }
}



export default { resetPassword, verify, changePassword };
