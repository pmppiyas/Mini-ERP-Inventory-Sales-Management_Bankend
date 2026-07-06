import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../error/appError';
import { setAuthCookie } from '../../utils/setCookie';
import { createUserToken } from '../../utils/Token';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(httpStatus.METHOD_FAILURE, err));
      }

      if (!user) {
        return next(new AppError(httpStatus.NOT_FOUND, info.message));
      }

      const userToken = createUserToken(user);

      setAuthCookie(res, userToken);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User Login Successfully',
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
        },
      });
    })(req, res, next);
  }
);

export const AuthController = {
  credentialsLogin,
};
