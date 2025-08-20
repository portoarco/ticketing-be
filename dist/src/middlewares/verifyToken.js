"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            throw new AppError_1.default("Token Not Found!", 404);
        }
        const checkToken = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY || "minprosecret");
        res.locals.decrypt = checkToken;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            next(new AppError_1.default("Token Expired", 401));
        }
        else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            next(new AppError_1.default("Invalid Token!", 401));
        }
        else {
            next(error);
        }
    }
};
exports.verifyToken = verifyToken;
