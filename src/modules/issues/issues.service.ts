import { pool } from "../../db";
import { ApiError } from "../../utils/ApiError";
import { validateInputs } from "../../utils/validateInput";
import type { IIssue, IIssuePayload } from "./issues.interface";

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

export const issueService = {
  create,
};
