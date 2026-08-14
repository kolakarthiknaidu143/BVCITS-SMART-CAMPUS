import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  placementId: mongoose.Types.ObjectId;
  studentUserId: mongoose.Types.ObjectId;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  appliedAt: Date;
  notes?: string;
}

const ApplicationSchema: Schema = new Schema(
  {
    placementId: { type: Schema.Types.ObjectId, ref: 'Placement', required: true },
    studentUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    appliedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

ApplicationSchema.index({ placementId: 1, studentUserId: 1 }, { unique: true });

export const Application = (mongoose.models.Application as mongoose.Model<IApplication>) || mongoose.model<IApplication>('Application', ApplicationSchema);
