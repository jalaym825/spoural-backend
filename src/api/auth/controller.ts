import { Request, Response } from "express";
import logger from "../../utils/logger";
import { PrismaClient } from '@prisma/client';
import { isValidEmail } from "../../utils/heplers";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import axios from "axios";
import crypto from "crypto";
import Mailer from "../../utils/mailer";

const prisma = new PrismaClient();

const genAccRefTokens = async (userId: any) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        await prisma.user.update({
            where: {
                userId
            },
            data: {
                refreshToken
            }
        });
        return { accessToken, refreshToken };
    } catch (err: any) {
        logger.error(`[/genAccRefTokens] - ${err.message}`);
        throw new Error("Something went wrong");
    }
}

const register = async (req: Request, res: Response) => {
    try {
        const { name, email, userId, password } = req.body;
        if (!email || !userId || !password) {
            logger.warn(`[/register] - data missing`);
            logger.debug(`[/register] - email: ${email}, userId: ${userId}`);
            return res.status(400).json({
                data: {
                    error: "Please provide all the required fields",
                }
            });
        }
        if (!isValidEmail(email)) {
            logger.warn(`[/register] - invalid email`);
            logger.debug(`[/register] - email: ${email}`);
            return res.status(400).json({
                data: {
                    error: "Please provide a valid email",
                }
            });
        }
        const user = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        });
        if (user) {
            logger.warn(`[/register] - email already exists`);
            logger.debug(`[/register] - email: ${email}`);
            return res.status(400).json({
                data: {
                    error: "Email already exists",
                }
            });
        }
        const user2 = await prisma.user.findFirst({
            where: {
                userId: userId.toLowerCase(),
            },
        });
        if (user2) {
            logger.warn(`[/register] - userId already exists`);
            logger.debug(`[/register] - userId: ${userId}`);
            return res.status(400).json({
                data: {
                    error: "UserId already exists",
                }
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                userId: userId.toLowerCase(),
                password: hashedPassword,
                role: "USER"
            },
        });
        logger.info(`[/register] - success - ${newUser.sis_id}`);
        logger.debug(`[/register] - email: ${email}, userId: ${userId}`);

        const res1 = await axios.post(`${process.env.SERVER_URL}/auth/sendVerificationMail`, {
            email: email.toLowerCase()
        });
        if (res1.data.error) {
            return res.status(500).json({
                data: {
                    error: res1.data.error
                }
            });
        }
        return res.status(200).json({
            data: {
                message: "User created successfully",
            }
        });
    } catch (err: any) {
        console.log(err);
        logger.error(`[/register] - ${err.message}`);
        return res.status(500).json({
            data: {
                error: "Something went wrong",
            }
        });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { emailOrUserId, password } = req.body;
        if (!emailOrUserId || !password) {
            logger.warn(`[/login] - data missing`);
            logger.debug(`[/login] - emailOrUserId: ${emailOrUserId}`);
            return res.status(400).json({
                data: {
                    error: "Please provide all the required fields",
                }
            });
        }
        let user: any;
        if (!isValidEmail(emailOrUserId)) {
            user = await prisma.user.findFirst({
                where: {
                    userId: emailOrUserId.toLowerCase(),
                },
            });
            if (!user) {
                logger.warn("[/login]: emailOrUserId invalid");
                logger.debug(`[/login] - emailOrUserId: ${emailOrUserId}`);
                return res.status(400).json({
                    data:
                    {
                        error: "Please provide a valid emailOrUserId",
                    }
                });
            }
        }

        user = await prisma.user.findFirst({
            where: {
                email: emailOrUserId.toLowerCase(),
            },
        });

        if (!user) {
            logger.warn("[/login]: user not found");
            logger.debug(`[/login] - emailOrUserId: ${emailOrUserId}`);
            return res.status(400).json({
                data:
                {
                    error: "User not found",
                }
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`[/login] - incorrect userId/email or password`);
            logger.debug(`[/login] - ${emailOrUserId}`);
            return res.status(400).json({
                data:
                {
                    error: "Incorrect username or password",
                }
            });
        }

        const { refreshToken, accessToken } = await genAccRefTokens(user.userId);
        logger.info(`[/login] - success - ${user.sis_id}`);
        logger.debug(`[/login] - ${emailOrUserId}`);

        let _user = { ...user };
        delete _user.password;
        delete _user.refreshToken;

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                data: {
                    user: _user,
                    accessToken, refreshToken
                },
            });
    }
    catch (err: any) {
        logger.error(`[/login] - ${err.message}`);
        return res.status(500).json({
            data:
            {
                error: "Something went wrong",
            }
        });
    }
}

const sendVerificationMail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            logger.warn(`[/sendVerificationMail] - data missing`);
            logger.debug(`[/sendVerificationMail] - email: ${email}`);
            return res.status(400).json({
                data: {
                    error: "Please provide all the required fields",
                }
            });
        }
        if (!isValidEmail(email)) {
            logger.warn(`[/sendVerificationMail] - invalid email`);
            logger.debug(`[/sendVerificationMail] - email: ${email}`);
            return res.status(400).json({
                data: {
                    error: "Please provide a valid email",
                }
            });
        }
        const user = await prisma.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        });
        if (!user) {
            logger.warn(`[/sendVerificationMail] - user not found`);
            logger.debug(`[/sendVerificationMail] - email: ${email}`);
            return res.status(400).json({
                data: {
                    error: "User not found",
                }
            });
        }
        const secretToken = crypto.randomBytes(32).toString("hex");
        const tokenData = await prisma.verificationToken.upsert({
            where: {
                sis_id: user.userId,
            },
            update: {
                sis_id: user.userId,
                token: secretToken,
                //expire infinte
                expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            create: {
                sis_id: user.userId,
                token: secretToken,
                //expire infinte
                expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        // create env variable for frontend url
        let link = `${process.env.SERVER_URL}/auth/verify/${tokenData.token}`;

        const nodemailer = new Mailer();
        nodemailer.sendMail([email], "Verify your email", {
            html: `<p>Click <a href="${link}">here</a> to verify your email</p>`,
            text: `Click this link to verify your email ${link}`,
        }).then((_info) => {
            logger.info(`[/sendVerificationMail] - success - ${user.sis_id}`);
            logger.debug(`[/sendVerificationMail] - email: ${email}`);
            return res.status(200).json({
                data: {
                    user,
                    message: "Verification mail sent",
                }
            });
        }).catch((_err) => {
            return res.status(200).json({
                data: {
                    message: "Error in sending mail",
                }
            });
        });
    } catch (err: any) {
        console.log(err);
        logger.error(`[/sendVerificationMail] - ${err.message}`);
        return res.status(500).json({
            data: {
                error: "Something went wrong",
            }
        });
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            logger.warn(`[/logout] - refreshToken not found`);
            return res.status(400).json({
                data: {
                    error: "Refresh token not found",
                }
            });
        }
        const user = await prisma.user.findFirst({
            where: {
                refreshToken
            }
        });
        if (!user) {
            logger.warn(`[/logout] - user not found`);
            return res.status(400).json({
                data: {
                    error: "User not found",
                }
            });
        }
        await prisma.user.update({
            where: {
                userId: user.userId
            },
            data: {
                refreshToken: null
            }
        });
        logger.info(`[/logout] - success - ${user.sis_id}`);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                data: {
                    message: "User logged out successfully",
                }
            });
    } catch (err: any) {
        logger.error(`[/logout] - ${err.message}`);
        return res.status(500).json({
            data: {
                error: "Something went wrong",
            }
        });
    }
}

const verify = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        if (!token) {
            logger.warn(`[/verify] - data missing`);
            logger.debug(`[/verify] - token: ${token}`);
            return res.status(400).json({
                data: {
                    error: "Please provide all the required fields",
                }
            });
        }
        const tokenData = await prisma.verificationToken.findFirst({
            where: {
                token
            }
        });
        if (!tokenData) {
            logger.warn(`[/verify] - token not found`);
            logger.debug(`[/verify] - token: ${token}`);
            return res.status(400).json({
                data: {
                    error: "Token not found",
                }
            });
        }
        await prisma.verificationToken.delete({
            where: {
                token
            }
        });
        if (tokenData.expiration < new Date()) {
            logger.warn(`[/verify] - token expired`);
            logger.debug(`[/verify] - token: ${token}`);
            return res.status(400).json({
                data: {
                    error: "Token expired",
                }
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                userId: tokenData.sis_id
            }
        });
        if (!user) {
            logger.warn(`[/verify] - user not found`);
            logger.debug(`[/verify] - token: sis_id: ${tokenData.sis_id}`);
            return res.status(400).json({
                data: {
                    error: "User not found",
                }
            });
        }
        if (user.rec_status) {
            logger.warn(`[/verify] - user already verified`);
            logger.debug(`[/verify] - userId: ${user.userId}`);
            return res.status(400).json({
                data: {
                    error: "User is already verified",
                }
            });
        }

        await prisma.user.update({
            where: {
                sis_id: user?.sis_id
            },
            data: {
                rec_status: true
            }
        });
        logger.info(`[/verify] - success - ${user.userId}`);
        logger.debug(`[/verify] - userId: ${user.userId}, token: ${token}`);
        return res.status(200).json({
            data: {
                message: "User verified successfully",
            }
        });
    } catch (err: any) {
        logger.error(`[/verify] - ${err.message}`);
        return res.status(500).json({
            data: {
                error: "Something went wrong",
            }
        });
    }
}
export default { login, register, sendVerificationMail, logout, verify };