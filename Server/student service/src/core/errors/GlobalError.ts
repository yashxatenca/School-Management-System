import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Operational error → safe to show
  if (err instanceof AppError) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: err.errors || null,
    });
  }

  // Unknown / Programming error
  console.error(' ERROR:', err);

  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
};
