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

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryServices.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Categories retrieved successfully!',
      data: categories,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryServices.updateCategory(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category updated successfully!',
      data: result,
    });
  }
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;

    const result = await CategoryServices.deleteCategory(categoryId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Category deleted successfully!',
      data: result,
    });
  }
);

export const CategoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
