import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.log(err.message);

  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: MESSAGES.SERVER_ERROR,
  });
};
