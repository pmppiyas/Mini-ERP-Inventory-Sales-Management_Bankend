import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import httpStatus from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../../interface';
import { PermissionServices } from './permission.services';
import { Permission } from './permission.constant';

const setPermission = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { taker, type }: { taker: Types.ObjectId; type: Permission[] } =
      req.body;

    const permission = await PermissionServices.setPermission(
      req.user as IJwtPayload,
      taker,
      type
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Permission set successfully',
      data: permission,
    });
  }
);

export const PermissionController = {
  setPermission,
};
