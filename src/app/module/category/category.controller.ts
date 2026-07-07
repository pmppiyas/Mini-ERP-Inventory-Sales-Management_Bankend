import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryServices } from './category.services';

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const category = await CategoryServices.addCategory(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Category created successfully!',
      data: category,
    });
  }
);

export const CategoryController = {
  createCategory,
};
