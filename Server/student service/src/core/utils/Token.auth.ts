import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/AppError"; // Adjust path if needed
import { Types } from "mongoose"; // Better to use Types.ObjectId if using Mongoose

interface TokenDetails {
  id: Types.ObjectId | string;
  email: string;
  role ?: string ; // ✅ Made required so you don't forget to pass it
}

export class Token {
  static createToken(data: TokenDetails): string {
    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret not configured", 500);
    }

    return jwt.sign(
      {
        id: data.id,
        email: data.email,
        role: data.role, // ✅ Uses the dynamic role passed from Controller
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  static verifyToken(token: string): JwtPayload {
    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret not configured", 500);
    }

    try {
      return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    } catch (error) {
      // Optional: You can log the specific error (expired vs invalid) here for debugging
      throw new AppError( "Invalid or expired token", 401);
    }
  }
}