import { AppError } from '../../error/appError';
import { IUser, IUserResponse } from './user,interface';
import httpStatus, { StatusCodes } from 'http-status-codes';
import { User } from './user.model';
import { hashingPassword } from '../../utils/hashingPassword';
import { QueryBuilder } from '../../utils/queryBuilder';

const createUser = async (userData: IUser): Promise<IUserResponse> => {
  try {
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      throw new AppError(
        httpStatus.CONFLICT,
        'User already exists with this email'
      );
    }

    const hashedPassword = await hashingPassword(userData.password);
    userData.password = hashedPassword;

    const user = await User.create(userData);

    const response: IUserResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      photoUrl: user.photoUrl,
      role: user.role,
      status: user.status,
      permissions: user.permissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async (query: Record<string, string> = {}) => {
  const searchableFields = ['name'];

  const queryBuilder = new QueryBuilder<IUser>(User.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    users: data as unknown as IUserResponse[],
    meta,
  };
};

const getUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUserResponse> => {
  console.log(payload);
  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (payload.email && payload.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: payload.email });

      if (emailExists) {
        throw new AppError(
          httpStatus.CONFLICT,
          'User already exists with this email'
        );
      }
    }

    if (payload.password) {
      payload.password = await hashingPassword(payload.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: payload },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const response: IUserResponse = {
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      photoUrl: updatedUser.photoUrl,
      role: updatedUser.role,
      status: updatedUser.status,
      permissions: updatedUser.permissions,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    console.log(response);

    return response;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  return await User.findByIdAndDelete(id);
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
