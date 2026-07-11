import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User create successfully',
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getAllUsers(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Users retrieved successfully',
      data: user,
    });
  }
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getUserById(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.deleteUser(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User deleted successfully',
      data: user,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
