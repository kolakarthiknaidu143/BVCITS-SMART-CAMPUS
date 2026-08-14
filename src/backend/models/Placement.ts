import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacement extends Document {
  recruiterUserId: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo?: string;
  jobRole: string;
  package: string;
  location: string;
  eligibilityCGPA: number;
  departmentEligibility: string[];
  deadline: string;
  description: string;
  requirements: string[];
}

const PlacementSchema: Schema = new Schema(
  {
    recruiterUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    jobRole: { type: String, required: true },
    package: { type: String, required: true },
    location: { type: String, required: true },
    eligibilityCGPA: { type: Number, required: true, default: 6.0 },
    departmentEligibility: [{ type: String }],
    deadline: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
  },
  { timestamps: true }
);

export const Placement = (mongoose.models.Placement as mongoose.Model<IPlacement>) || mongoose.model<IPlacement>('Placement', PlacementSchema);
