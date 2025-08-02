// Eky - start
import { sign } from "jsonwebtoken";

export const createToken = (user: any, expiresIn: any = "1h") => {
  const token = sign(
    { id: user.id, isVerified: user.isVerified, role: user.role },
    process.env.TOKEN_KEY || "secret",
    { expiresIn }
  );
  return token;
};
// Eky - end
