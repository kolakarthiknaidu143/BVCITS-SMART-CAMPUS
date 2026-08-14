import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  registrationStatus: 'Open' | 'Closed' | 'Invite-Only';
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    organizer: { type: String, required: true },
    registrationStatus: { type: String, enum: ['Open', 'Closed', 'Invite-Only'], default: 'Open' },
  },
  { timestamps: true }
);

export const Event = (mongoose.models.Event as mongoose.Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema);
