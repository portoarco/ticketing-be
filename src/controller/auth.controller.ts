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
import { resetPasswordEmail } from "../templates/resetpass";

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
        { expiresIn: "15m" }
      );

      // console.log(token);

      res.status(200).send({
        success: true,
        message: "Login Success",
        result: {
          id: login.id,
          // first_name: login.first_name,
          // last_name: login.last_name,
          email: login.email,
          // isVerified: login.isVerified,
          // country: login.country,
          // phone_number: login.phone_number,
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

  public async forgetPass(req: Request, res: Response, next: NextFunction) {
    try {
      // check unique based on req.body
      const { email } = req.body;
      const account = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      // validate account availablity

      if (!account) {
        throw new AppError("Account Not Found", 404);
      }

      // generate token for reset pass

      const token = sign(
        {
          id: account.id,
          email: account.email,
          first_name: account.first_name,
        },
        process.env.TOKEN_KEY || "minprosecret",
        { expiresIn: "15m" }
      );

      await transport.sendMail({
        sender: process.env.MAILSENDER,
        to: account.email,
        subject: "Reset Password",
        html: resetPasswordEmail(
          account.first_name,
          account.email,
          `${process.env.URL_FE}/reset-password/${token}`
        ),
      });

      res.status(200).send({
        success: true,
        message: "Perika Email Anda untuk Reset Password",
      });
    } catch (error) {
      next(error);
    }
  }

  public async resetPass(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.users.update({
        where: {
          id: res.locals.decrypt.id,
        },
        data: {
          password: await hashPassword(req.body.password),
        },
      });

      res.status(201).send({ success: true, message: "Update Success!" });
    } catch (error) {
      next(error);
    }
  }

  public async registerOrganizer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = res.locals.decrypt.id;

      const existingOrganizer = await prisma.organizer.findFirst({
        where: { user_id },
      });

      if (existingOrganizer) {
        // throw new AppError("Already Registered as Organizer!", 500);
        return res.status(500).send({
          success: false,
          message: "Already registered as organizer",
          isNew: false,
        });
      }

      const newOrganizer = await prisma.organizer.create({
        data: { user_id },
      });
      res.status(201).send({ success: true, data: newOrganizer });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
