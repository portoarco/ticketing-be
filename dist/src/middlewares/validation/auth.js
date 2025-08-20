"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regisValidator = void 0;
const express_validator_1 = require("express-validator");
// response error handler
const resValidationHandler = (req, res, next) => {
    try {
        const errorValidation = (0, express_validator_1.validationResult)(req);
        if (!errorValidation.isEmpty()) {
            throw errorValidation.array();
        }
        else {
            next();
        }
    }
    catch (error) {
        next(error);
    }
};
// user input validator
exports.regisValidator = [
    (0, express_validator_1.body)("first_name").notEmpty().withMessage("First Name is required"),
    (0, express_validator_1.body)("last_name").notEmpty().withMessage("Last Name is required"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid Format Email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
        .withMessage("Invalid Format Password"),
    (0, express_validator_1.body)("birthdate").notEmpty(),
    (0, express_validator_1.body)("phone_number").notEmpty(),
    resValidationHandler,
];
