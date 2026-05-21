import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    const { success, statusCode, message, errors } = err;
    return res.status(statusCode).json({ success, message, errors });
  }

  if (err instanceof Error) {
    const { message } = err;
    return res
      .status(500)
      .json({ success: false, message, errors: [err.message] });
  }

  return res
    .status(500)
    .json({
      success: false,
      message: "Unknown Error",
      errors: ["Unknown Error"],
    });
};

export { globalErrorHandler };
