import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiErrors";

export const errorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 ERROR MESSAGE:", err.message);
  console.error("🔥 ERROR STACK:", err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value found",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
