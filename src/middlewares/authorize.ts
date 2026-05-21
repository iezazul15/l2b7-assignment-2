import type { NextFunction, Request, Response } from "express";
import type { Role } from "../types";
import { ApiError } from "../utils/ApiError";

const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(false, 401, "Unauthorized");
    }

    if (!roles.includes(req.user?.role)) {
      throw new ApiError(false, 403, "Forbidden");
    }

    next();
  };

export { authorize };
