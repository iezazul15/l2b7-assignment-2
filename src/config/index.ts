import dotenv from "dotenv";
import path from "path";

dotenv.config({
  quiet: true,
  path: path.join(process.cwd(), ".env"),
});

const requiredEnvVariables = [
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "DATABASE_URL",
] as const;

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is missing in environment variables`);
  }
});

export const config = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL!,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
};
