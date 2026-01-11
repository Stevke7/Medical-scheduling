import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@medical/shared';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const userSchema = new Schema<IUserDocument>(
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
      default: 'UTC', // IANA timezone string
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

export const User = mongoose.model<IUserDocument>('User', userSchema);
