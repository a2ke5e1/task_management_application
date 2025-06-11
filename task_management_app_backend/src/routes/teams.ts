import { Router, Request, Response } from "express";

const teamsRouter = Router();

teamsRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ Hello: "Teams" });
});

export default teamsRouter;
