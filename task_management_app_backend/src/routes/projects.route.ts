import { Router, Request, Response } from "express";
import Projects from "../models/projects.model";
import validateResource from "../middleware/validateResource";
import {
  CreateProjectInput,
  createProjectSchema,
  DeleteProjectInput,
  deleteProjectSchema,
  getAllProjectSchema,
  getPageNumberSchema,
  GetProjectPageNumberInput,
  getProjectSchema,
  ReadAllProjectInput,
  ReadProjectInput,
  UpdateProjectInput,
  updateProjectSchema,
} from "../schema/projects.schema";

const projectsRouter = Router();

projectsRouter.get(
  "/",
  validateResource(getAllProjectSchema),
  async (
    req: Request<{}, {}, {}, ReadAllProjectInput["query"]>,
    res: Response
  ) => {
    try {
      const { page, limit } = req.query;
      if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const data = await Projects.find({})
          .populate("teamMembers")
          .skip(skip)
          .limit(limit);
        const total = await Projects.countDocuments();
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
      const data = await Projects.find({}).populate("teamMembers");
      res.json({ data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

projectsRouter.get(
  "/:projectId",
  validateResource(getProjectSchema),
  async (req: Request<ReadProjectInput["params"], {}, {}>, res: Response) => {
    try {
      const { projectId } = req.params;
      const data = await Projects.findOne({ _id: projectId }).populate(
        "teamMembers"
      );
      res.status(200).json({ data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

projectsRouter.post(
  "/",
  validateResource(createProjectSchema),
  async (req: Request<{}, {}, CreateProjectInput["body"]>, res: Response) => {
    try {
      const { name, description, teamMembers } = req.body;
      const data = await Projects.create({ name, description, teamMembers });
      res.status(201).json({ msg: "Created successfully", data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

projectsRouter.put(
  "/:projectId",
  validateResource(updateProjectSchema),
  async (
    req: Request<UpdateProjectInput["params"], {}, UpdateProjectInput["body"]>,
    res: Response
  ) => {
    try {
      const { projectId } = req.params;
      const { name, description, teamMembers } = req.body;
      const data = await Projects.findOneAndUpdate(
        { _id: projectId },
        { name, description, teamMembers },
        { new: true }
      );
      res.status(200).json({ msg: "Updated successfully", data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

projectsRouter.delete(
  "/:projectId",
  validateResource(deleteProjectSchema),
  async (req: Request<DeleteProjectInput["params"], {}, {}>, res: Response) => {
    try {
      const { projectId } = req.params;
      await Projects.findOneAndDelete({ _id: projectId });
      res.status(204).json({ msg: "Deleted successfully" });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// api to get page number of a project
// this a helper api to find the page number of a project
projectsRouter.get(
  "/find-page/:projectId",
  validateResource(getPageNumberSchema),
  async (
    req: Request<
      GetProjectPageNumberInput["params"],
      {},
      {},
      Partial<Record<keyof GetProjectPageNumberInput["query"], string>>
    >,
    res: Response
  ) => {
    try {
      const limit = Number(req.query.limit);
      const { projectId } = req.params;
      // Get the project document
      const project = await Projects.findById(projectId).lean();
      if (!project) {
        res.status(404).json({ msg: "Project not found" });
        return;
      }

      // Count how many projects were created *before* this one, using same sort order
      const index = await Projects.countDocuments({
        createdAt: { $lt: project.createdAt },
      });

      const page = Math.floor(index / limit) + 1;

      res.json({ data: { page } });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

export default projectsRouter;
