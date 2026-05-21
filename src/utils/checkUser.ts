import { pool } from "../db";
import type { IUser } from "../modules/auth/auth.interface";

const checkUser = async (email: string) => {
  const dbResponse = await pool.query<IUser>(
    `
        SELECT * FROM users WHERE email=$1`,
    [email],
  );
  return dbResponse.rows[0];
};

export { checkUser };
