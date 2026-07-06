import mongoose, { Schema, model } from 'mongoose';
import { IsActive, Role, IUserDocument } from './user,interface';

mongoose.set('strictQuery', false);

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function (this: any) {
        return !this.auths || this.auths.length === 0;
      },
    },

    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.EMPLOYEE,
    },

    status: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUserDocument>('User', userSchema);
