import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import type { CustomJwtPayload } from "../interfaces";
import { ApiError } from "../utils/ApiError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(false, 401, "Unauthorized");
  }

  const payload = jwt.verify(
    token,
    config.ACCESS_TOKEN_SECRET,
  ) as CustomJwtPayload;

  req.user = payload;

  next();
};

export { isAuthenticated };
