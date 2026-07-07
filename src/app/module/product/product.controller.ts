import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { ProductService } from './product,services';
import { Types } from 'mongoose';

const addProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const createdBy = new Types.ObjectId(req?.user?.userId as string);

    const product = await ProductService.addProduct(
      req.body,
      createdBy as Types.ObjectId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Product added successfully',
      data: product,
    });
  }
);

export const ProductController = {
  addProduct,
};
