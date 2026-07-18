import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { SellServices } from './sell.services';
import { IJwtPayload } from '../../interface';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createSell = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sell = await SellServices.createSell(
      req?.user as IJwtPayload,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Sell added successfully',
      data: sell,
    });
  }
);

export const SellController = {
  createSell,
};
