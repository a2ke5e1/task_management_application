import mongoose from "mongoose";

export interface TeamsInput {
  name: string;
  email: string;
  designation: string;
}

export interface TeamDocument extends TeamsInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    designation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TeamModel = mongoose.model<TeamDocument>("Teams", teamSchema);

export default TeamModel;
