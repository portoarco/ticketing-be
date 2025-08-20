"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
// Eky - start
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (user, expiresIn = "1h") => {
    // console.log("createToken id : ", user.id);
    const token = (0, jsonwebtoken_1.sign)({ id: user.id, isVerified: user.isVerified }, process.env.TOKEN_KEY || "minprosecret", { expiresIn });
    return token;
};
exports.createToken = createToken;
// Eky - end
