import { JwtUser } from '../../interfaces/admin.interface';
import { ApiError } from '../../core/errors/ApiErrors';
import { Token } from '../../core/utils/user.token';
import type { Request, Response, NextFunction } from 'express';

export const authenticationmiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.teachertoken;

    if (!token) {
      throw new ApiError(401, 'Auth token is missing');
    }

    const decoded = Token.verifyToken(token);
    req.user = decoded as JwtUser;

    next();
  } catch (error) {
    next(error);
  }
};
