import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { prisma } from "../config/prisma";
import { hashPassword } from "../../utils/hash";
import { transport } from "../config/nodemailer";
import { regisTemplateMail } from "../templates/registemplate";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { generateKey } from "crypto";
import { generateRefferalCode } from "../../utils/generateCode";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        country,
        birthdate,
        phone_number,
        referrer_code,
      } = req.body;

      const hashedPassword = await hashPassword(password);

      let findReferrer = null;

      if (referrer_code) {
        findReferrer = await prisma.users.findUnique({
          where: { refferal_code: referrer_code },
        });

        if (!findReferrer) {
          throw new AppError("Referrer Data Not Found", 404);
        }
      }

      // if ok, create new user
      const newUser = await prisma.users.create({
        data: {
          first_name,
          last_name,
          email,
          password: hashedPassword,
          country,
          birthdate,
          phone_number,
          referrer_code,
          refferal_code: generateRefferalCode(first_name),
        },
      });

      if (findReferrer) {
        // generate points for referrer
        const reffererPoints = await prisma.referral_Code.create({
          data: {
            user_id: findReferrer.id,
            code: findReferrer?.refferal_code || "null",
            points: 10000,
            expired_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        });

        // generate voucher discount for new user
        const newUserVoucher = await prisma.voucher.create({
          data: {
            user_id: newUser.id,
            code: "NEWUSER",
            percentage: 25,
            expired_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        });
      }

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
      next(error);
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
        { expiresIn: "10s" }
      );

      // console.log(token);

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
      next(error);
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
      next(error);
    }
  }

  public async verifyOrganizer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await prisma;
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
