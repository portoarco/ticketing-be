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
const prisma_1 = require("../config/prisma");
const AppError_1 = __importDefault(require("../errors/AppError"));
const createToken_1 = require("../../utils/createToken");
const cloudinary_1 = require("../config/cloudinary");
class UserController {
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.decrypt.id;
                // console.log("Checking res.locals.decrypt.id : ", id);
                const user = yield prisma_1.prisma.users.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        phone_number: true,
                        avatar: true,
                        refferal_code: true,
                        isVerified: true,
                        organizer: {
                            select: {
                                organizer_name: true,
                            },
                        },
                        referral_user: true,
                    },
                });
                // console.log(user);
                if (!user) {
                    throw new AppError_1.default("User Not Found", 404);
                }
                const token = (0, createToken_1.createToken)(user, "2h");
                res
                    .status(200)
                    .send({ success: true, result: Object.assign(Object.assign({}, user), { token }), token: token });
            }
            catch (error) {
                next(error);
            }
        });
    }
    editUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = res.locals.decrypt.id;
                let { first_name, last_name, email, password, phone_number, organizer_name, avatar, } = req.body;
                // convert to uppercase all user input
                if (typeof first_name === "string") {
                    first_name = first_name.toUpperCase();
                }
                if (typeof last_name === "string") {
                    last_name = last_name.toUpperCase();
                }
                // // check file
                // if (!req.file) {
                //   throw new AppError("No File Exist ", 404);
                // }
                let uploadedAvatarUrl = avatar;
                if (req.file) {
                    // upload cloudinary
                    const upload = yield (0, cloudinary_1.cloudinaryUpload)(req.file);
                    uploadedAvatarUrl = upload.secure_url;
                }
                const updateUser = yield prisma_1.prisma.users.update({
                    where: { id },
                    data: {
                        first_name,
                        last_name,
                        email,
                        password,
                        phone_number,
                        avatar: uploadedAvatarUrl,
                    },
                });
                if (organizer_name) {
                    yield prisma_1.prisma.organizer.update({
                        where: { user_id: id },
                        data: {
                            organizer_name,
                        },
                    });
                }
                // console.log(updateUser);
                res
                    .status(200)
                    .send({ success: true, message: "update success", data: updateUser });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
