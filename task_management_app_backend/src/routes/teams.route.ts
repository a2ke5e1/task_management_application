import { Router, Request, Response } from "express";
import Teams from "../models/teams.model";
import {
  CreateTeamInput,
  createTeamSchema,
  DeleteTeamInput,
  deleteTeamSchema,
  UpdateTeamInput,
  updateTeamSchema,
  ReadTeamInput,
  getTeamSchema,
  getAllTeamSchema,
  ReadAllTeamInput,
} from "../schema/teams.schema";
import validateResource from "../middleware/validateResource";

const teamsRouter = Router();

teamsRouter.get(
  "/",
  validateResource(getAllTeamSchema),
  async (
    req: Request<{}, {}, {}, ReadAllTeamInput["query"]>,
    res: Response
  ) => {
    try {
      const { page, limit } = req.query;
      if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const data = await Teams.find({}).skip(skip).limit(limit);
        const total = await Teams.countDocuments();
        const hasMore = limit * page < total;

        res.json({
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasMore,
          data,
        });
        return;
      }
      const data = await Teams.find({});
      res.json({ data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

teamsRouter.get(
  "/:teamId",
  validateResource(getTeamSchema),
  async (req: Request<ReadTeamInput["params"], {}, {}>, res: Response) => {
    try {
      const { teamId } = req.params;
      const data = await Teams.findOne({ _id: teamId });
      res.status(200).json({ data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

teamsRouter.post(
  "/",
  validateResource(createTeamSchema),
  async (req: Request<{}, {}, CreateTeamInput["body"]>, res: Response) => {
    try {
      const { name, email, designation } = req.body;
      const data = await Teams.create({ name, email, designation });
      res.status(201).json({ msg: "Created successfully", data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

teamsRouter.put(
  "/:teamId",
  validateResource(updateTeamSchema),
  async (
    req: Request<UpdateTeamInput["params"], {}, UpdateTeamInput["body"]>,
    res: Response
  ) => {
    try {
      const { teamId } = req.params;
      const { name, email, designation } = req.body;
      const data = await Teams.findOneAndUpdate(
        { _id: teamId },
        { name, email, designation },
        { new: true }
      );
      res.status(200).json({ msg: "Updated successfully", data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

teamsRouter.delete(
  "/:teamId",
  validateResource(deleteTeamSchema),
  async (req: Request<DeleteTeamInput["params"], {}, {}>, res: Response) => {
    try {
      const { teamId } = req.params;
      await Teams.findOneAndDelete({ _id: teamId });
      res.status(204).json({ msg: "Deleted successfully" });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

export default teamsRouter;
