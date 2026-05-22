import { pool } from "../../db";
import type { IssueStatus, Role } from "../../types";
import { ApiError } from "../../utils/ApiError";
import { validateInputs } from "../../utils/validateInput";
import type { IUser } from "../auth/auth.interface";
import type {
  FormattedIssues,
  IIssue,
  IIssuePayload,
  IIssueQueryParams,
  IIssueUpdatePayload,
} from "./issues.interface";

const create = async (userId: string, payload: IIssuePayload) => {
  const { title, description, type } = payload;
  const status: IssueStatus = "open";

  validateInputs.isFieldMissing(payload, ["title", "description", "type"]);
  validateInputs.isEmptyValue(payload, ["title", "description", "type"]);

  const dbResponse = await pool.query<IIssue>(
    `
        INSERT INTO issues(title, description, type, status, reporter_id)
        VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [title, description, type, status, userId],
  );

  const issue = dbResponse.rows[0]!;

  return issue;
};

const getAll = async (params: IIssueQueryParams) => {
  const { sort = "newest", type, status } = params;

  const dbResponse = await pool.query<IIssue>(
    `
        SELECT *
        FROM issues
        WHERE type = COALESCE($1, type)
        AND status = COALESCE($2, status)
        ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}

    `,
    [type, status],
  );

  const issues = dbResponse.rows;

  const formattedIssues: FormattedIssues[] = [];

  for (const issue of issues) {
    const reporter = await pool.query<IUser>(
      `
      SELECT id, name, role
      FROM users
      WHERE id = $1
    `,
      [issue.reporter_id],
    );

    formattedIssues.push({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporter.rows[0]!,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    });
  }
  return formattedIssues;
};

const getSingle = async (id: string) => {
  const dbResponse = await pool.query<IIssue>(
    `
        SELECT *
        FROM issues
        WHERE id = $1
        
    `,
    [id],
  );

  if (dbResponse.rows.length === 0) {
    throw new ApiError(false, 404, "Issue not found");
  }

  const issue = dbResponse.rows[0]!;

  const reporter = await pool.query<IUser>(
    `
      SELECT id, name, role
      FROM users
      WHERE id = $1
    `,
    [issue.reporter_id],
  );
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporter.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const update = async (
  issueId: string,
  userId: string,
  role: Role,
  payload: IIssueUpdatePayload,
) => {
  const { title, description, type, status } = payload;
  if (role === "maintainer") {
    const dbResponse = await pool.query<IIssue>(
      `
        UPDATE issues
        SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = COALESCE($4, status)
        WHERE id = $5
        RETURNING *
      `,
      [title, description, type, status, issueId],
    );

    if (dbResponse.rows.length === 0) {
      throw new ApiError(false, 404, "Issue not found");
    }

    const updatedIssue = dbResponse.rows[0];

    return updatedIssue;
  }

  if (role === "contributor") {
    const dbResponse = await pool.query<IIssue>(
      `
        SELECT * FROM issues WHERE id = $1
      `,
      [issueId],
    );

    if (dbResponse.rows.length === 0) {
      throw new ApiError(false, 404, "No issues found with this id");
    }

    const issue = dbResponse.rows[0]!;

    const { reporter_id, status } = issue;

    if (!status) {
      throw new ApiError(
        false,
        403,
        "Not allowed to update the status of the issue",
      );
    }

    if (userId !== String(reporter_id) || status !== "open") {
      throw new ApiError(false, 403, "Not allowed to update the issue");
    }

    const response = await pool.query<IIssue>(
      `
        UPDATE issues
        SET title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type)
        WHERE id = $4
        RETURNING *
      `,
      [title, description, type, issueId],
    );
    if (response.rows.length === 0) {
      throw new ApiError(false, 404, "Issue not found");
    }

    const updatedIssue = response.rows[0];

    return updatedIssue;
  }
};

const deleteSingle = async (id: string) => {
  const dbResponse = await pool.query(
    `
      DELETE FROM issues
      WHERE id = $1
    `,
    [id],
  );

  return (dbResponse.rowCount ?? 0) > 0;
};

export const issueService = {
  create,
  getAll,
  getSingle,
  update,
  deleteSingle,
};
