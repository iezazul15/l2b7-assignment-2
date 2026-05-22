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

const getAllIssues = asyncHandler(async (req: Request, res: Response) => {
  const issues = await issueService.getAll(req.query);
  return res.status(200).json(new ApiResponse(true, undefined, issues));
});

const getSingleIssue = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const issue = await issueService.getSingle(id);
  return res.status(200).json(new ApiResponse(true, undefined, issue));
});

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};
