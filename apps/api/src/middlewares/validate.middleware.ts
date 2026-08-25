// src/middleware/validate.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, type ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema instanceof ZodObject && "body" in schema.shape) {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } else {
        await schema.parseAsync(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path[issue.path.length - 1],
          message: issue.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Data tidak valid",
          errors: formattedErrors,
        });
      }

      next(error);
    }
  };
};
