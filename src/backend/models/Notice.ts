import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  description: string;
  category: 'Academic' | 'Placement' | 'Event' | 'General';
  audience: 'All' | 'Students' | 'Parents' | 'Faculty' | 'Recruiters' | 'Trainers';
  expiryDate?: Date;
  createdBy: mongoose.Types.ObjectId;
}

const NoticeSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Academic', 'Placement', 'Event', 'General'],
      default: 'General',
    },
    audience: {
      type: String,
      enum: ['All', 'Students', 'Parents', 'Faculty', 'Recruiters', 'Trainers'],
      default: 'All',
    },
    expiryDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Notice = (mongoose.models.Notice as mongoose.Model<INotice>) || mongoose.model<INotice>('Notice', NoticeSchema);
