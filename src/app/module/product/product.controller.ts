import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';
import { ProductService } from './product,services';
import { Types } from 'mongoose';
import { IJwtPayload } from '../../interface';

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

const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductService.updateProduct(
      req.params.productId,
      req.body,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Product updated successfully',
      data: product,
    });
  }
);

const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await ProductService.deleteProduct(
      req.params.productId,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Product deleted successfully',
    });
  }
);

export const ProductController = {
  addProduct,
  updateProduct,
  deleteProduct,
};
