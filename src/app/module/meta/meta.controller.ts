import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { MetaServices } from './meta.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { Role } from '../user/user,interface';

const getMeta = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const meta = await MetaServices.getMeta(req.user?.role as Role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Dashboard meta retrieved successfully',
      data: meta,
    });
  }
);

export const MetaController = {
  getMeta,
};
