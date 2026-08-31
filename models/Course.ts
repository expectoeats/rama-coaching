import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICourse extends Document {
  name: string;
  description: string;
  duration: string;
  fees: string;
  category: string;
  accent: string;
  status: "active" | "inactive";
  deletedAt?: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    fees: { type: String, required: true },
    category: { type: String, required: true },
    accent: { type: String, default: "#1F3354" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

CourseSchema.index({ status: 1 });

export default (mongoose.models.Course as Model<ICourse>) || mongoose.model<ICourse>("Course", CourseSchema);
