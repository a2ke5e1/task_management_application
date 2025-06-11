import { Router, Request, Response } from "express";

const projectsRouter = Router();

projectsRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({ Hello: "Projects" });
});

export default projectsRouter;
