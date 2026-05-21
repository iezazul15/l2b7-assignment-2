import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import { config } from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
  }),
);

app.use("/api/auth", authRoute);

app.use("/api/issues", issuesRoute);

app.use(globalErrorHandler);

export default app;
