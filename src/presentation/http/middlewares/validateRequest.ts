import { ZodTypeAny, ZodError, TypeOf } from "zod";
import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "shared/constants/httpStatus";

interface ParsedRequest {
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export const validateRequest =
  <T extends ZodTypeAny>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsed = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        }) as TypeOf<T> & ParsedRequest;

        if (parsed.body) Object.assign(req.body, parsed.body);
        if (parsed.query) Object.assign(req.query, parsed.query);
        if (parsed.params) Object.assign(req.params, parsed.params);

        next();
      } catch (err) {
        if (err instanceof ZodError) {
          const error = err.issues?.[0]?.message ?? "Validation error";

          return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error,
          });
        }
        next(err);
      }
    };