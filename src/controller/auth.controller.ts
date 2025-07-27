import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { prisma } from "../config/prisma";
import { hashPassword } from "../../utils/hash";
import { transport } from "../config/nodemailer";
import { regisTemplateMail } from "../templates/registemplate";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    const {
      first_name,
      last_name,
      email,
      password,
      country,
      birthdate,
      phone_number,
    } = req.body;

    try {
      const hashedPassword = await hashPassword(password);
      const newUser = await prisma.users.create({
        data: {
          first_name,
          last_name,
          email,
          password: hashedPassword,
          country,
          birthdate,
          phone_number,
        },
      });

      // token isVerified (in register function)
      const token = sign(
        { id: newUser.id, isVerified: newUser.isVerified },
        process.env.TOKEN_KEY || "minprosecret",
        { expiresIn: "10m" }
      );
      // urlfe
      const urlFE = `${process.env.URL_FE}/verify/${token}`;

      await transport.sendMail({
        from: process.env.MAILSENDER,
        to: newUser.email,
        subject: "Email Verification",
        html: regisTemplateMail(newUser.first_name, urlFE),
      });

      res.status(201).send({ success: true, data: newUser });
    } catch (error) {
      throw new AppError("Something went wrong", 500);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const login = await prisma.users.findUnique({
        where: { email },
      });

      if (!login) {
        throw new AppError("Account is not exist!", 404);
      } else {
        const comparePassword = await compare(password, login.password);

        if (!comparePassword) {
          throw new AppError("Wrong Password", 401);
        }
      }

      // token
      const token = sign(
        { id: login.id, isVerified: login.isVerified },
        process.env.TOKEN_KEY || "minprosecret",
        { expiresIn: "1h" }
      );

      res.status(200).send({
        success: true,
        message: "Login Success",
        result: {
          first_name: login.first_name,
          last_name: login.last_name,
          email: login.email,
          isVerified: login.isVerified,
          country: login.country,
          phone_number: login.phone_number,
          token,
        },
      });
    } catch (error) {
      throw new AppError("Something went wrong", 500);
    }
  }

  public async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.users.update({
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
    } catch (error) {
      throw new AppError("Something went wrong", 500);
    }
  }
}

export default AuthController;
