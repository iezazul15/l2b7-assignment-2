import type { IssueSorting, IssueStatus, IssueType } from "../../types";
import type { IUser } from "../auth/auth.interface";

export interface IIssuePayload {
  title: string;
  description: string;
  type: IssueType;
}

export interface IIssueUpdatePayload extends IIssuePayload {
  status?: IssueStatus;
}

export interface IIssueQueryParams {
  sort?: IssueSorting;
  type?: IssueType;
  status?: IssueStatus;
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface FormattedIssues {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  reporter: IUser;
  created_at: Date;
  updated_at: Date;
}
