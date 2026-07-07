import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../error/appError';
import { clearAuthCookies, setAuthCookie } from '../../utils/cookies';
import { JwtPayload } from 'jsonwebtoken';
import { AuthService } from './auth.services';
import { createUserToken } from '../../utils/token';

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

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userId = user?.userId;
    const data = await AuthService.getMe(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Self get Successfully',
      data: data,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    clearAuthCookies(res);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Logout successfully',
      data: null,
    });
  }
);

export const AuthController = {
  credentialsLogin,
  getMe,
  logout,
};
