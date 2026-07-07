import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import { AppError } from '../error/appError';
import { ENV } from '../config/env';
import { verifyToken } from '../utils/token';
import { User } from '../module/user/user.model';
import { IsActive, Role } from '../module/user/user,interface';
import { IJwtPayload } from '../interface';

export const checkAuth = (...authRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req?.headers?.authorization || req?.cookies['access-token'];

      if (!accessToken) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No Token Received');
      }

      const verifiedToken = verifyToken(
        accessToken,
        ENV.JWT.ACCESS_TOKEN
      ) as IJwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'You are not permitted for this route'
        );
      }

      if (!Types.ObjectId.isValid(verifiedToken.userId)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID format');
      }

      const isUserExist = await User.findById(verifiedToken.userId);

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist');
      }

      if (isUserExist.status === IsActive.BLOCK) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.status} and not allowed to access this route`
        );
      }

      req.user = verifiedToken;

      next();
    } catch (err) {
      next(err);
    }
  };
};
