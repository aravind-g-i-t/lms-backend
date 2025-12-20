import { ZodType, ZodError, TypeOf } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends ZodType<any, any>>(schema: T) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const parsed: TypeOf<T> = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });


        if (parsed.body) Object.assign(req.body, parsed.body);
        if (parsed.query) Object.assign(req.query, parsed.query);
        if (parsed.params) Object.assign(req.params, parsed.params);

        next();
      } catch (err) {
        if (err instanceof ZodError) {
          const error = err.issues?.[0]?.message || "Validation error";

          return res.status(400).json({
            success: false,
            message: error,
          });
        }
        next(err);
      }
    };
