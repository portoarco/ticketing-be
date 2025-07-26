import { body, validationResult } from "express-validator";
import AppError from "../../errors/AppError";
import { Request, Response, NextFunction } from "express";

// response error handler
const resValidationHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errorValidation = validationResult(req);
    if (!errorValidation.isEmpty()) {
      throw errorValidation.array();
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// user input validator
export const regisValidator = [
  body("first_name").notEmpty().withMessage("First Name is required"),
  body("last_name").notEmpty().withMessage("Last Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email"),
  body("password").notEmpty().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  body("birthdate").notEmpty(),
  body("phone_number").notEmpty(),
  resValidationHandler,
];
