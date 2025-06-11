import { Router, Request, Response } from "express";
import Teams from "../models/teams";

const teamsRouter = Router();

teamsRouter.get("/", async (req: Request, res: Response) => {
  const data = await Teams.find({});
  res.status(200).json({ data });
});

teamsRouter.post("/", async (req: Request, res: Response) => {
  const { name, email, designation } = req.body;
  const data = await Teams.create({ name, email, designation });
  res.status(201).json({ msg: "Created Successfully", data });
});

export default teamsRouter;
