import type { NextFunction, Request, Response } from "express";
import type { AsyncController } from "../types";

const asyncHandler =
  (fn: AsyncController) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export { asyncHandler };
