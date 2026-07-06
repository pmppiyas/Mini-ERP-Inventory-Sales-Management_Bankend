import { AppError } from '../../error/appError';
import { User } from '../user/user.model';
import httpStatus from 'http-status-codes';

const getMe = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { password: _password, ...rest } = user.toObject();
  return rest;
};

export const AuthService = { getMe };
