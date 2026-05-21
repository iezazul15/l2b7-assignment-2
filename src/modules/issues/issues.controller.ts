import type { Request, Response } from "express";
import type { AuthUser } from "../../types";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { issueService } from "./issues.service";

const createIssue = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user as AuthUser;
  const issue = await issueService.create({ id, ...req.body });
  return res
    .status(201)
    .json(new ApiResponse(true, "Issue created successfully", issue));
});

export const issuesController = {
  createIssue,
};
