import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";
import { logger } from "@infrastructure/logging/Logger";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    if (err instanceof AppError) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                success: false,
                message: err.message,
            });
        }
    }

    logger.warn(`Uncaught error:${err.message}`);

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
    });
};
