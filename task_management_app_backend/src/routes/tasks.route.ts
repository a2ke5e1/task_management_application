import { Router, Request, Response } from "express";
import Tasks from "../models/tasks.model";
import {
  CreateTaskInput,
  createTaskSchema,
  DeleteTaskInput,
  deleteTaskSchema,
  UpdateTaskInput,
  updateTaskSchema,
  ReadTaskInput,
  getTaskSchema,
  getAllTaskSchema,
  ReadAllTaskInput,
} from "../schema/tasks.schema";
import validateResource from "../middleware/validateResource";

const tasksRouter = Router();

tasksRouter.get(
  "/",
  validateResource(getAllTaskSchema),
  async (
    req: Request<{}, {}, {}, ReadAllTaskInput["query"]>,
    res: Response
  ) => {
    try {
      const {
        page,
        limit,
        projectId,
        memberId,
        status,
        search,
        startDate,
        endDate,
      } = req.query;

      const query: any = {};

      // Filter by project
      if (projectId) {
        query.projectId = projectId;
      }

      // Filter by assigned member
      if (memberId) {
        query.assignedMembers = { $in: [memberId] };
      }

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Search by title or description (case-insensitive partial match)
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by deadline range
      if (startDate || endDate) {
        query.deadline = {};
        if (startDate) {
          query.deadline.$gte = new Date(startDate);
        }
        if (endDate) {
          query.deadline.$lte = new Date(endDate);
        }
      }

      if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const data = await Tasks.find(query)
          .populate("assignedMembers")
          .populate("project")
          .skip(skip)
          .limit(limit);
        const total = await Tasks.countDocuments();
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
      const data = await Tasks.find(query)
        .populate("assignedMembers")
        .populate("project");
      res.json({ data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

tasksRouter.get(
  "/:taskId",
  validateResource(getTaskSchema),
  async (req: Request<ReadTaskInput["params"], {}, {}>, res: Response) => {
    try {
      const { taskId } = req.params;
      const data = await Tasks.findOne({ _id: taskId })
        .populate("assignedMembers")
        .populate("project");
      res.status(200).json({ data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

tasksRouter.post(
  "/",
  validateResource(createTaskSchema),
  async (req: Request<{}, {}, CreateTaskInput["body"]>, res: Response) => {
    try {
      const { title, description, deadline, project, assignedMembers, status } =
        req.body;
      const data = await Tasks.create({
        title,
        description,
        deadline,
        project,
        assignedMembers,
        status,
      });
      res.status(201).json({ msg: "Created successfully", data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

tasksRouter.put(
  "/:taskId",
  validateResource(updateTaskSchema),
  async (
    req: Request<UpdateTaskInput["params"], {}, UpdateTaskInput["body"]>,
    res: Response
  ) => {
    try {
      const { taskId } = req.params;
      const { title, description, deadline, project, assignedMembers, status } =
        req.body;
      const data = await Tasks.findOneAndUpdate(
        { _id: taskId },
        {
          title,
          description,
          deadline,
          project,
          assignedMembers,
          status,
        },
        { new: true }
      );
      res.status(200).json({ msg: "Updated successfully", data });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

tasksRouter.delete(
  "/:taskId",
  validateResource(deleteTaskSchema),
  async (req: Request<DeleteTaskInput["params"], {}, {}>, res: Response) => {
    try {
      const { taskId } = req.params;
      await Tasks.findOneAndDelete({ _id: taskId });
      res.status(204).json({ msg: "Deleted successfully" });
    } catch (e: any) {
      console.warn(e);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

export default tasksRouter;
