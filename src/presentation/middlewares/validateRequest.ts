import { ZodType, ZodError, TypeOf } from "zod";
import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "shared/constants/messages";

export const validateRequest =
  <T extends ZodType<any, any>>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed: TypeOf<T> = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // req.body = parsed.body ?? req.body;
      // req.query = parsed.query ?? req.query;
      // req.params = parsed.params ?? req.params;


       if (parsed.body) Object.assign(req.body, parsed.body);
      if (parsed.query) Object.assign(req.query, parsed.query);
      if (parsed.params) Object.assign(req.params, parsed.params);

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err);
        
        
        return res.status(400).json({
          success: false,
          message:MESSAGES.SERVER_ERROR,
          error: err.message,
        });
      }
      next(err);
    }
  };
