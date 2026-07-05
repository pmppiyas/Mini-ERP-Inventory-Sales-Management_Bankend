import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const User = await UserService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User create successfully',
      data: User,
    });
  }
);

export const UserController = {
  createUser,
};
