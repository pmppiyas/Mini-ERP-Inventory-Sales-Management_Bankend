import { AppError } from '../../error/appError';
import { IUser, IUserResponse } from './user,interface';
import httpStatus from 'http-status-codes';
import { User } from './user.model';

const createUser = async (userData: IUser): Promise<IUserResponse> => {
  try {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new AppError(
        httpStatus.CONFLICT,
        'User already exists with this email'
      );
    }

    const user = await User.create(userData);

    const response: IUserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  } catch (error) {
    throw error;
  }
};

export const UserService = {
  createUser,
};
