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
      photoUrl: user.photoUrl,
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

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
};
