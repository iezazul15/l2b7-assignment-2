import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { pool } from "../../db";
import { ApiError } from "../../utils/ApiError";
import { checkUser } from "../../utils/checkUser";
import { userMapper } from "../../utils/userMapper";
import { validateInputs } from "../../utils/validateInput";
import {
  type ILoginPayload,
  type IRegisterPayload,
  type IUser,
} from "./auth.interface";

const register = async (payload: IRegisterPayload) => {
  const { name, email, password, role = "contributor" } = payload;

  validateInputs.isFieldMissing(payload, ["name", "email", "password"]);
  validateInputs.isEmptyValue(payload, ["name", "email", "password"]);

  const userExists = await checkUser(email);

  if (userExists) {
    throw new ApiError(false, 400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const dbResponse = await pool.query<IUser>(
    `
        INSERT INTO users(name, email, password, role)
        VALUES($1, $2, $3, $4)
        RETURNING *
    `,
    [name, email, hashedPassword, role],
  );

  const user = dbResponse.rows[0]!;

  if (!user) {
    throw new ApiError(false, 500, "User creation failed");
  }

  const safeUser = userMapper(user);

  return safeUser;
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  validateInputs.isFieldMissing(payload, ["email", "password"]);
  validateInputs.isEmptyValue(payload, ["email", "password"]);

  const userExists = await checkUser(email);

  if (!userExists) {
    throw new ApiError(false, 400, "User with this email does not exist");
  }

  const matchedPassword = bcrypt.compare(password, userExists.password);

  if (!matchedPassword) {
    throw new ApiError(false, 401, "Email or Password does not match");
  }

  const { id, name, role, created_at, updated_at } = userExists;

  const jwtPayload = {
    id,
    name,
    email,
    role,
    created_at,
    updated_at,
  };

  const accessToken = jwt.sign(jwtPayload, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(jwtPayload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken, user: jwtPayload };
};

export const authService = {
  register,
  login,
};
