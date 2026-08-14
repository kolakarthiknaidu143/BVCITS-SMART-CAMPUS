import mongoose, { Schema, Document } from 'mongoose';

export interface IModule {
  _id?: string;
  title: string;
  completed: boolean;
  resources?: string[];
}

export interface IParticipantProgress {
  studentUserId: mongoose.Types.ObjectId;
  progressPercentage: number;
  attendanceCount: number;
  totalSessions: number;
  status: 'Enrolled' | 'In Progress' | 'Completed' | 'Certified';
  grade?: string;
  notes?: string;
  updatedAt?: Date;
}

export interface ITraining extends Document {
  trainerUserId?: mongoose.Types.ObjectId;
  trainerName: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  startDate?: string;
  venue?: string;
  maxSeats?: number;
  skills: string[];
  eligibility: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  resources: string[];
  modules: IModule[];
  enrolledStudents: mongoose.Types.ObjectId[];
  participantProgress: IParticipantProgress[];
}

const TrainingSchema: Schema = new Schema(
  {
    trainerUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    trainerName: { type: String, default: 'Industry Specialist Trainer' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Skill Bootcamp' },
    duration: { type: String, required: true },
    startDate: { type: String, default: '' },
    venue: { type: String, default: 'Computer Lab' },
    maxSeats: { type: Number, default: 60 },
    skills: [{ type: String }],
    eligibility: { type: String, default: 'All Departments' },
    status: { type: String, enum: ['Upcoming', 'In Progress', 'Completed'], default: 'In Progress' },
    resources: [{ type: String }],
    modules: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        resources: [{ type: String }],
      },
    ],
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    participantProgress: [
      {
        studentUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        progressPercentage: { type: Number, default: 0 },
        attendanceCount: { type: Number, default: 0 },
        totalSessions: { type: Number, default: 10 },
        status: { type: String, enum: ['Enrolled', 'In Progress', 'Completed', 'Certified'], default: 'Enrolled' },
        grade: { type: String, default: 'A' },
        notes: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Training = (mongoose.models.Training as mongoose.Model<ITraining>) || mongoose.model<ITraining>('Training', TrainingSchema);

