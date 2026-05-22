import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { config } from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";
import { ApiResponse } from "./utils/ApiResponse";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(true, "Server is up and running"));
});

app.use("/api/auth", authRoute);

app.use("/api/issues", issuesRoute);

app.use(globalErrorHandler);

export default app;
