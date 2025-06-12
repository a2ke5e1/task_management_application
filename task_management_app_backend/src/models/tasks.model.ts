import mongoose from "mongoose";

export interface TasksInput {
  title: string;
  description: string;
  deadline: Date;
  project: string;
  assignedMembers: string[];
  status: "to-do" | "in-progress" | "done" | "cancelled";
}

export interface TaskDocument extends TasksInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Projects",
    },
    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams",
      },
    ],
    status: {
      type: String,
      enum: ["to-do", "in-progress", "done", "cancelled"],
      required: true,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model<TaskDocument>("Tasks", taskSchema);

export default TaskModel;
