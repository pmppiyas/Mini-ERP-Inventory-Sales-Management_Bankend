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

export const PermissionServices = {
  setPermission,
};
