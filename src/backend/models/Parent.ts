import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  userId: mongoose.Types.ObjectId;
  studentRollNumber: string;
  studentUserId: mongoose.Types.ObjectId;
  occupation?: string;
}

const ParentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    studentRollNumber: { type: String, required: true },
    studentUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    occupation: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Parent = (mongoose.models.Parent as mongoose.Model<IParent>) || mongoose.model<IParent>('Parent', ParentSchema);
