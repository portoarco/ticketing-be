// Eky - start
import { sign } from "jsonwebtoken";

export const createToken = (user: any, expiresIn: any = "1h") => {
  // console.log("createToken id : ", user.id);
  const token = sign(
    { id: user.id, isVerified: user.isVerified },
    process.env.TOKEN_KEY || "minprosecret",
    { expiresIn }
  );
  return token;
};
// Eky - end
