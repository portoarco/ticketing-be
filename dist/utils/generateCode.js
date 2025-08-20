"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefferalCode = generateRefferalCode;
function generateRefferalCode(first_name) {
    return (first_name.replace(/\s_/g, "").slice(0, 3) +
        Math.random().toString(36).substring(2, 6).toUpperCase());
}
