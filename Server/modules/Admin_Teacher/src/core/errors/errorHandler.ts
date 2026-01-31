import type {Request, Response, NextFunction } from 'express';
import { ApiError
 } from './ApiErrors';
import { stat } from 'node:fs';

export const errorhandler = (
     err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) =>{
    let statusCode = 500;
    let message = "Internal Server Error";
    if(err instanceof ApiError){
        statusCode =err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
