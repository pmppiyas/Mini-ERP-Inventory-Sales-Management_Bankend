import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import { SaleServices } from './sale.services';
import { IJwtPayload } from '../../interface';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const createSale = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sale = await SaleServices.createSale(
      req?.user as IJwtPayload,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Sale added successfully',
      data: sale,
    });
  }
);

const getSales = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sale = await SaleServices.getSales(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Sales retrieved successfully',
      data: sale,
    });
  }
);

export const SaleController = {
  createSale,
  getSales,
};
