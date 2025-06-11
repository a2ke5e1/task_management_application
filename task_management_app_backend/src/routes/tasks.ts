import { Router, Request, Response } from "express";

const tasksRouter = Router();

tasksRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ Hello: "Tasks" });
});

export default tasksRouter;
