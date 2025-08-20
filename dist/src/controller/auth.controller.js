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
const AppError_1 = __importDefault(require("../errors/AppError"));
const prisma_1 = require("../config/prisma");
const hash_1 = require("../../utils/hash");
const nodemailer_1 = require("../config/nodemailer");
const registemplate_1 = require("../templates/registemplate");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const generateCode_1 = require("../../utils/generateCode");
const resetpass_1 = require("../templates/resetpass");
const createToken_1 = require("../../utils/createToken");
class AuthController {
    getUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.decrypt.id;
                const user = yield prisma_1.prisma.users.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        isVerified: true,
                        organizer: { select: { organizer_name: true } },
                    },
                });
                if (!user) {
                    throw new AppError_1.default("User not found", 404);
                }
                if (!user.isVerified) {
                    throw new AppError_1.default("Account not verified", 403);
                }
                res.status(200).send({
                    success: true,
                    message: "Fetch user data success",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name, email, password, country, birthdate, phone_number, referrer_code, } = req.body;
                const hashedPassword = yield (0, hash_1.hashPassword)(password);
                let findReferrer = null;
                if (referrer_code) {
                    findReferrer = yield prisma_1.prisma.users.findUnique({
                        where: { refferal_code: referrer_code },
                    });
                    if (!findReferrer) {
                        throw new AppError_1.default("Referrer Data Not Found", 404);
                    }
                }
                // if ok, create new user
                const newUser = yield prisma_1.prisma.users.create({
                    data: {
                        first_name,
                        last_name,
                        email,
                        password: hashedPassword,
                        country,
                        birthdate,
                        phone_number,
                        referrer_code,
                        refferal_code: (0, generateCode_1.generateRefferalCode)(first_name),
                    },
                });
                if (findReferrer) {
                    // generate points for referrer
                    const reffererPoints = yield prisma_1.prisma.referral_Code.create({
                        data: {
                            user_id: findReferrer.id,
                            code: (findReferrer === null || findReferrer === void 0 ? void 0 : findReferrer.refferal_code) || "null",
                            points: 10000,
                            expired_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                        },
                    });
                    // generate voucher discount for new user
                    const newUserVoucher = yield prisma_1.prisma.voucher.create({
                        data: {
                            user_id: newUser.id,
                            code: "NEWUSER",
                            percentage: 25,
                            expired_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                        },
                    });
                }
                // token isVerified (in register function)
                const token = (0, jsonwebtoken_1.sign)({ id: newUser.id, isVerified: newUser.isVerified }, process.env.TOKEN_KEY || "minprosecret", { expiresIn: "10m" });
                // urlfe
                const urlFE = `${process.env.URL_FE}/verify/${token}`;
                yield nodemailer_1.transport.sendMail({
                    from: process.env.MAILSENDER,
                    to: newUser.email,
                    subject: "Email Verification",
                    html: (0, registemplate_1.regisTemplateMail)(newUser.first_name, urlFE),
                });
                res.status(201).send({ success: true, data: newUser });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const login = yield prisma_1.prisma.users.findUnique({
                    where: { email },
                });
                if (!login) {
                    throw new AppError_1.default("Account is not exist!", 404);
                }
                else {
                    const comparePassword = yield (0, bcrypt_1.compare)(password, login.password);
                    if (!comparePassword) {
                        throw new AppError_1.default("Wrong Password", 401);
                    }
                }
                // token
                // const token = sign(
                //   {
                //     id: login.id,
                //     isVerified: login.isVerified,
                //   },
                //   process.env.TOKEN_KEY || "minprosecret",
                //   { expiresIn: "25h" }
                // );
                const token = (0, createToken_1.createToken)(login, "2h");
                // console.log(token);
                res.status(200).send({
                    success: true,
                    message: "Login Success",
                    result: {
                        id: login.id,
                        first_name: login.first_name,
                        // last_name: login.last_name,
                        email: login.email,
                        // isVerified: login.isVerified,
                        // country: login.country,
                        // phone_number: login.phone_number,
                        token,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma_1.prisma.users.update({
                    where: {
                        id: res.locals.decrypt.id,
                    },
                    data: {
                        isVerified: true,
                    },
                });
                res.status(200).send({
                    success: true,
                    message: "Verification Success!",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgetPass(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check unique based on req.body
                const { email } = req.body;
                const account = yield prisma_1.prisma.users.findUnique({
                    where: {
                        email,
                    },
                });
                // validate account availablity
                if (!account) {
                    throw new AppError_1.default("Account Not Found", 404);
                }
                // generate token for reset pass
                const token = (0, jsonwebtoken_1.sign)({
                    id: account.id,
                    email: account.email,
                    first_name: account.first_name,
                }, process.env.TOKEN_KEY || "minprosecret", { expiresIn: "15m" });
                yield nodemailer_1.transport.sendMail({
                    sender: process.env.MAILSENDER,
                    to: account.email,
                    subject: "Reset Password",
                    html: (0, resetpass_1.resetPasswordEmail)(account.first_name, account.email, `${process.env.URL_FE}/reset-password/${token}`),
                });
                res.status(200).send({
                    success: true,
                    message: "Perika Email Anda untuk Reset Password",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPass(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.prisma.users.update({
                    where: {
                        id: res.locals.decrypt.id,
                    },
                    data: {
                        password: yield (0, hash_1.hashPassword)(req.body.password),
                    },
                });
                res.status(201).send({ success: true, message: "Update Success!" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    checkOrganizer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = res.locals.decrypt.id;
                const existingOrganizer = yield prisma_1.prisma.organizer.findFirst({
                    where: { user_id },
                });
                const isVerified = yield prisma_1.prisma.users.findFirst({
                    where: { id: user_id, isVerified: true },
                });
                console.log(isVerified);
                if (!isVerified) {
                    return res.status(500).send({
                        success: false,
                        message: "You have to verify your account before create event!s",
                        isVerified: false,
                    });
                }
                if (!existingOrganizer) {
                    return res.status(404).send({ message: "No existing organizers" });
                }
                res.status(200).send({
                    success: true,
                    message: "User and Organizer name already registered",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    registerOrganizer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = res.locals.decrypt.id;
            const { organizer_name } = req.body;
            console.log(organizer_name);
            try {
                if (!user_id) {
                    throw new AppError_1.default("Invalid Data", 500);
                }
                // add to organizer
                const newOrganizer = yield prisma_1.prisma.organizer.create({
                    data: { user_id },
                });
                // update organizer name
                if (!organizer_name || !user_id) {
                    throw new AppError_1.default("Error, check console", 500);
                }
                const organizerName = yield prisma_1.prisma.organizer.update({
                    where: { user_id },
                    data: {
                        organizer_name,
                    },
                });
                res.status(201).send({
                    message: "Organizer id successfuly created",
                    data: {
                        newOrganizer,
                        organizerName,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;
