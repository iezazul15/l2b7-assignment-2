import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { issuesController } from "./issues.controller";

const router: Router = Router();

router.post(
  "/",
  isAuthenticated,
  authorize("contributor", "maintainer"),
  issuesController.createIssue,
);

export const issuesRoute = router;
