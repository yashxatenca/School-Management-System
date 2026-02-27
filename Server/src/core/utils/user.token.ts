import  jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../errors/ApiErrors";

interface TokenDetails {
  id: string;
  email: string;
  role: string;
}

export class Token {
  static createToken(data: TokenDetails): string {
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT secret not configured");
    }

    return jwt.sign(
      {
        id: data.id,
        email: data.email,
        role: data.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  static verifyToken(token: string): JwtPayload {
    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, "JWT secret not configured");
    }

    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as JwtPayload;
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }
  }
}
