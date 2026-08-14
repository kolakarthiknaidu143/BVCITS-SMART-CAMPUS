import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  department: string;
  designation: string;
  assignedSubjects: string[];
}

const FacultySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true, default: 'Assistant Professor' },
    assignedSubjects: [{ type: String }],
  },
  { timestamps: true }
);

export const Faculty = (mongoose.models.Faculty as mongoose.Model<IFaculty>) || mongoose.model<IFaculty>('Faculty', FacultySchema);
