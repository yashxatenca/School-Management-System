import { JwtUser } from '../../core/interface/interface.app';
import { AppError } from '../../core/errors/AppError';
import { Token } from '../../core/utils/Token.auth';
import type { Request, Response, NextFunction } from 'express';

export const authenticationmiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.teachertoken;

    if (!token) {
      throw new AppError( 'Auth token is missing',401);
    }

    const decoded = Token.verifyToken(token);
    req.user = decoded as JwtUser;

    next();
  } catch (error) {
    next(error);
  }
};
