import mongoose from "mongoose";

export interface ProjectInput {
  name: string;
  description: string;
  teamMembers: string[];
}

export interface ProjectDocument extends ProjectInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams",
      },
    ],
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model<ProjectDocument>("Projects", projectSchema);

export default ProjectModel;
