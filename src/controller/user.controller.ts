import { Response, Request, NextFunction } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";
import { createToken } from "../../utils/createToken";
import { cloudinaryUpload } from "../config/cloudinary";

class UserController {
  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decrypt.id;
      console.log("Checking res.locals.decrypt.id : ", id);

      const user = await prisma.users.findUnique({
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
        },
      });

      console.log(user);

      if (!user) {
        throw new AppError("User Not Found", 404);
      }

      const token = createToken(user, "2h");

      res
        .status(200)
        .send({ success: true, result: { ...user, token }, token: token });
    } catch (error) {
      next(error);
    }
  }

  public async editUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = res.locals.decrypt.id;
      let {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        organizer_name,
        avatar,
      } = req.body;

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
        const upload = await cloudinaryUpload(req.file);
        uploadedAvatarUrl = upload.secure_url;
      }

      const updateUser = await prisma.users.update({
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
        await prisma.organizer.update({
          where: { user_id: id },
          data: {
            organizer_name,
          },
        });
      }

      console.log(updateUser);

      res
        .status(200)
        .send({ success: true, message: "update success", data: updateUser });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
