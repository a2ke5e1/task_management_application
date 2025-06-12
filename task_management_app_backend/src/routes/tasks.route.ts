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
      const { page, limit } = req.query;
      if (page !== undefined && limit !== undefined) {
        const skip = (page - 1) * limit;
        const data = await Tasks.find({}).skip(skip).limit(limit);
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
      const data = await Tasks.find({});
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
      const data = await Tasks.findOne({ _id: taskId });
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
      const {
        title,
        description,
        deadline,
        projectId,
        assignedMembers,
        status,
      } = req.body;
      const data = await Tasks.create({
        title,
        description,
        deadline,
        projectId,
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
      const {
        title,
        description,
        deadline,
        projectId,
        assignedMembers,
        status,
      } = req.body;
      const data = await Tasks.findOneAndUpdate(
        { _id: taskId },
        { title, description, deadline, projectId, assignedMembers, status },
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
