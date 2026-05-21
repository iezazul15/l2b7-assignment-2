import { type NextFunction, type Request, type Response } from "express";
import type { IUser } from "../modules/auth/auth.interface";

export const Roles = ["contributor", "maintainer"] as const;

export type Role = (typeof Roles)[number];

export const ValidateRegisterFields = ["name", "email", "password"] as const;

export type RegisterField = (typeof ValidateRegisterFields)[number];

export const ValidateLoginFields = ["email", "password"] as const;

export type LoginField = (typeof ValidateLoginFields)[number];

export const IssueTypes = ["bug", "feature_request"] as const;

export type IssueType = (typeof IssueTypes)[number];

export const IssueStatuses = ["open", "in_progress", "resolved"] as const;

export type IssueStatus = (typeof IssueStatuses)[number];

export type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export type SafeUser = Omit<IUser, "password">;

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
