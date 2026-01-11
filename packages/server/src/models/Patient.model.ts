import mongoose, { Schema, Document } from 'mongoose';
import { IPatient } from '@medical/shared';

export interface IPatientDocument extends Omit<IPatient, '_id'>, Document {}

const patientSchema = new Schema<IPatientDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'UTC', // IANA timezone string - updated on each login
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
patientSchema.index({ email: 1 });

export const Patient = mongoose.model<IPatientDocument>('Patient', patientSchema);
