import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'parent' | 'faculty' | 'admin' | 'recruiter' | 'trainer';
  phone?: string;
  profileImage?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'parent', 'faculty', 'admin', 'recruiter', 'trainer'],
      required: true,
      default: 'student',
    },
    phone: { type: String, default: '' },
    profileImage: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
