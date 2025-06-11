import mongoose from "mongoose";

export interface Teams {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  designation: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new mongoose.Schema<Teams>(
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
    },
    designation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Teams ||
  mongoose.model<Teams>("Teams", TeamSchema);
