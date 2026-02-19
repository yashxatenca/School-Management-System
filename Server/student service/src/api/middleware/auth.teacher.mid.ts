import { JwtUser } from '../../core/interface/interface.app';
import { AppError } from '../../core/errors/AppError';
import { Token } from '../../core/utils/Token.auth';
import type { Request, Response, NextFunction } from 'express';

// 1. Define a custom interface extending the standard Request
interface AuthRequest extends Request {
  user?: JwtUser;
}

export const authteachermiddleware = async (
  req: AuthRequest, // 2. Use AuthRequest instead of Request
  res: Response,
  next: NextFunction
) => {
  try {
    const token =  req.cookies?.student_token ? req.cookies.student_token : req.cookies?.teacher_token;

    if (!token) {
      throw new AppError('Auth token is missing', 401);
    }

    const decoded = Token.verifyToken(token);
    
    // 3. This now works because AuthRequest includes 'user'
    req.user = decoded as JwtUser;

    next();
  } catch (error) {
    next(error);
  }
};