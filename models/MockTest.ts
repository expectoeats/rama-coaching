import mongoose, { Document, Schema, Model } from "mongoose";

export interface IQuestion {
  _id?: mongoose.Types.ObjectId;
  questionText: string;
  options: string[]; // exactly 4 options
  correctOption: number; // 0-indexed
  explanation?: string;
  marks: number;
}

export interface IMockTest extends Document {
  title: string;
  description: string;
  subject: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  questions: IQuestion[];
  status: "active" | "inactive";
  attemptLimit: number; // max free attempts (default 10)
  deletedAt?: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length === 4,
      message: "Each question must have exactly 4 options",
    },
  },
  correctOption: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, default: "" },
  marks: { type: Number, required: true, default: 1 },
});

const MockTestSchema = new Schema<IMockTest>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true, default: 30 },
    totalMarks: { type: Number, required: true, default: 10 },
    passingMarks: { type: Number, required: true, default: 5 },
    questions: { type: [QuestionSchema], default: [] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    attemptLimit: { type: Number, default: 10 },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

MockTestSchema.index({ status: 1 });

export default (mongoose.models.MockTest as Model<IMockTest>) ||
  mongoose.model<IMockTest>("MockTest", MockTestSchema);
