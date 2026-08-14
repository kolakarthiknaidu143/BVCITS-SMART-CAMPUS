import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  code: string;
  hodName: string;
  totalStudents: number;
  totalFaculty: number;
}

const DepartmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    hodName: { type: String, default: 'TBD' },
    totalStudents: { type: Number, default: 0 },
    totalFaculty: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Department = (mongoose.models.Department as mongoose.Model<IDepartment>) || mongoose.model<IDepartment>('Department', DepartmentSchema);
