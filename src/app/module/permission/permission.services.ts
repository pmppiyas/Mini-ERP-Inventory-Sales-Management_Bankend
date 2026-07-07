import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../error/appError';
import { IJwtPayload } from '../../interface';
import { User } from '../user/user.model';
import { managerGiveablePermissions, Permission } from './permission.constant';
import { Types } from 'mongoose';

const setPermission = async (
  giver: IJwtPayload,
  taker: Types.ObjectId,
  type: Permission[]
) => {
  const ADMIN = giver.role === 'ADMIN';
  const MANAGER = giver.role === 'MANAGER';
  const MANAGER_AUTHORITY = type.every((permission) =>
    Object.values(managerGiveablePermissions).includes(permission)
  );

  const TAKER = await User.findById(taker);

  if (!TAKER) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Taker not found!');
  }

  if (ADMIN) {
    const updatedUser = await User.findByIdAndUpdate(
      taker,
      {
        $addToSet: {
          permissions: {
            $each: type,
          },
        },
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    if (!updatedUser) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
    }

    return updatedUser;
  }

  if (MANAGER && MANAGER_AUTHORITY) {
    if (TAKER.role === 'EMPLOYEE') {
      const updatedUser = await User.findByIdAndUpdate(
        taker,
        {
          $addToSet: {
            permissions: {
              $each: type,
            },
          },
        },
        {
          returnDocument: 'after',
          runValidators: true,
        }
      );

      if (!updatedUser) {
        throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
      }

      return updatedUser;
    }
  } else {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not permitted for this action!'
    );
  }
};

const removePermission = async (
  remover: IJwtPayload,
  userId: Types.ObjectId,
  type: Permission[]
) => {
  const ADMIN = remover.role === 'ADMIN';
  const MANAGER = remover.role === 'MANAGER';

  const MANAGER_AUTHORITY = type.every((permission) =>
    managerGiveablePermissions.includes(permission)
  );

  const USER = await User.findById(userId);

  if (!USER) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  if (ADMIN) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          permissions: {
            $in: type,
          },
        },
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    return updatedUser;
  }

  if (MANAGER && MANAGER_AUTHORITY) {
    if (USER.role !== 'EMPLOYEE') {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Manager can only remove permissions from employees.'
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          permissions: {
            $in: type,
          },
        },
      },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    return updatedUser;
  }

  throw new AppError(
    StatusCodes.UNAUTHORIZED,
    'You are not permitted for this action!'
  );
};

export const PermissionServices = {
  setPermission,
  removePermission,
};
