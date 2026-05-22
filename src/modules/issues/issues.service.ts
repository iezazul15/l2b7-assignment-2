import { pool } from "../../db";
import type { Role } from "../../types";
import { ApiError } from "../../utils/ApiError";
import { validateInputs } from "../../utils/validateInput";
import type {
  IIssue,
  IIssuePayload,
  IIssueQueryParams,
  IIssueUpdatePayload,
} from "./issues.interface";

const create = async (payload: IIssuePayload) => {
  const { id, title, description, type, status = "open" } = payload;

  validateInputs.isFieldMissing(payload, ["title", "description", "type"]);
  validateInputs.isEmptyValue(payload, ["title", "description", "type"]);

  const dbResponse = await pool.query<IIssue>(
    `
        INSERT INTO issues(title, description, type, status, reporter_id)
        VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [title, description, type, status, id],
  );

  const issue = dbResponse.rows[0];

  if (!issue) {
    throw new ApiError(false, 500, "Issue creation failed");
  }

  return issue;
};

const getAll = async (params: IIssueQueryParams) => {
  const { sort = "newest", type, status } = params;

  const issues = await pool.query<IIssue>(
    `
        SELECT *
        FROM issues
        WHERE type = COALESCE($1, type)
        AND status = COALESCE($2, status)
        ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}

    `,
    [type, status],
  );

  if (!issues) {
    throw new ApiError(false, 500, "Failed to retrieve issues");
  }

  const formattedIssues = [];

  for (const issue of issues.rows) {
    const reporter = await pool.query(
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
      reporter: reporter.rows[0],
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

  const issue = dbResponse.rows[0];

  if (!issue) {
    throw new ApiError(false, 500, "Failed to retrieve issues");
  }

  const reporter = await pool.query(
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
  const { title, description, type } = payload;
  if (role === "maintainer") {
    const dbResponse = await pool.query(
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
    return dbResponse.rows[0];
  }

  if (role === "contributor") {
    const dbResponse = await pool.query<IIssue>(
      `
        SELECT * FROM issues WHERE id = $1
      `,
      [issueId],
    );

    const issue = dbResponse.rows[0];

    if (!issue) {
      throw new ApiError(false, 500, "No issues found with this id");
    }

    const { reporter_id, status } = issue;

    if (userId !== String(reporter_id) || status !== "open") {
      throw new ApiError(false, 500, "Not allowed to update the issue");
    }

    const response = await pool.query(
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
    return response.rows[0];
  }
};

export const issueService = {
  create,
  getAll,
  getSingle,
  update,
};
