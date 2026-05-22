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

router.get("/", issuesController.getAllIssues);

router.get("/:id", issuesController.getSingleIssue);

router.patch(
  "/:id",
  isAuthenticated,
  authorize("contributor", "maintainer"),
  issuesController.updateIssue,
);

export const issuesRoute = router;
