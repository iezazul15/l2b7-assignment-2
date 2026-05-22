import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { issuesController } from "./issues.controller";

const router: Router = Router();

router.post(
  "/",
  authenticate,
  authorize("contributor", "maintainer"),
  issuesController.createIssue,
);

router.get("/", issuesController.getAllIssues);

router.get("/:id", issuesController.getSingleIssue);

router.patch(
  "/:id",
  authenticate,
  authorize("contributor", "maintainer"),
  issuesController.updateIssue,
);

router.delete(
  "/:id",
  authenticate,
  authorize("maintainer"),
  issuesController.deleteIssue,
);

export const issuesRoute = router;
