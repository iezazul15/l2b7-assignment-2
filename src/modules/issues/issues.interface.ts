import type { IssueStatus, IssueType } from "../../types";

export interface IIssuePayload {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
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
