import mongoose, { Schema, Document, Types } from 'mongoose';
import { IEvent } from '@medical/shared';

export interface IEventDocument extends Omit<IEvent, '_id' | 'doctorId' | 'patientId'>, Document {
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
}

const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
eventSchema.index({ doctorId: 1, startTime: 1 });
eventSchema.index({ patientId: 1, startTime: 1 });
eventSchema.index({ startTime: 1, reminderSent: 1 }); // For reminder scheduler

export const Event = mongoose.model<IEventDocument>('Event', eventSchema);
