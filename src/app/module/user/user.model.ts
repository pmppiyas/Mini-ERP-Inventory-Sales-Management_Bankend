import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IAuths, IsActive, IUserDocument } from './user,interface';

mongoose.set('strictQuery', false);

const authSchema = new Schema<IAuths>(
  {
    provider: {
      type: String,
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

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
      select: false,
    },

    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.EMPLOYEE,
    },

    auths: {
      type: [authSchema],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isPasswordMatch = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model<IUserDocument>('User', userSchema);
