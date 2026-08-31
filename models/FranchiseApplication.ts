import mongoose, { Document, Schema, Model } from "mongoose";

export interface IFranchiseApplication extends Document {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  message: string;
  status: "pending" | "contacted" | "approved" | "rejected";
  date: Date;
  deletedAt?: Date;
}

const FranchiseApplicationSchema = new Schema<IFranchiseApplication>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "contacted", "approved", "rejected"], default: "pending", required: true },
    date: { type: Date, default: Date.now },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

FranchiseApplicationSchema.index({ status: 1 });
FranchiseApplicationSchema.index({ createdAt: 1 });

export default (mongoose.models.FranchiseApplication as Model<IFranchiseApplication>) || mongoose.model<IFranchiseApplication>("FranchiseApplication", FranchiseApplicationSchema);
