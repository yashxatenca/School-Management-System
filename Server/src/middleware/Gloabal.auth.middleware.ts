import type { JwtUser } from "../Global_Interface/global.interface";
import { ApiError } from "../core/errors/ApiErrors";
import { Token } from "../core/utils/user.token";
import type { Request, Response, NextFunction } from "express";

export const GlobalAuthMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        throw new ApiError(401, "Authentication required");
      }

      const decoded = Token.verifyToken(token);
      if (!decoded || !allowedRoles.includes(decoded.role)) {
        throw new ApiError(403, "Access denied");
      }

      req.user = decoded as JwtUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};
