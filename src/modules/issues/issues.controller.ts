import type { Request, Response } from "express";
import type { AuthUser } from "../../types";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import type { IIssueUpdatePayload } from "./issues.interface";
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
  const id = req.params?.id as string;
  const issue = await issueService.getSingle(id);
  return res.status(200).json(new ApiResponse(true, undefined, issue));
});

const updateIssue = asyncHandler(async (req: Request, res: Response) => {
  const { id, role } = req?.user as AuthUser;
  const userId = String(id);
  const issueId = req.params?.id as string;
  const payload: IIssueUpdatePayload = req.body;
  const updatedIssue = await issueService.update(
    issueId,
    userId,
    role,
    payload,
  );
  return res
    .status(200)
    .json(new ApiResponse(true, "Issue updated successfully", updatedIssue));
});

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
};
