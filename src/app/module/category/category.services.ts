import { AppError } from '../../error/appError';
import { Category } from '../../module/category/category.model';
import { ICategory } from '../../module/category/category.interface';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import slugify from 'slugify';

const addCategory = async (payload: {
  name: string;
  children?: { name: string }[];
  parentId?: string;
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isCategoryExist = await Category.findOne({
      name: payload.name,

      parentId: payload.parentId,
    }).session(session);

    if (isCategoryExist) {
      throw new AppError(
        StatusCodes.CONFLICT,
        'Category already exists in this level!'
      );
    }

    const createdCategories = await Category.create(
      [
        {
          name: payload.name,
          slug: slugify(payload.name, {
            lower: true,
            strict: true,
          }),
          parentId: payload.parentId,
        },
      ],
      { session }
    );

    const newCategory = createdCategories[0];

    if (!newCategory) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Failed to create category'
      );
    }

    let createdChildren: ICategory[] = [];

    if (payload.children?.length) {
      const childrenToCreate = payload.children.map((child) => ({
        name: child.name,
        slug: slugify(child.name, {
          lower: true,
          strict: true,
        }),
        parentId: newCategory._id,
      }));

      createdChildren = await Category.insertMany(childrenToCreate, {
        session,
      });
    }

    await session.commitTransaction();
    await session.endSession();

    return {
      category: newCategory,
      children: createdChildren,
    };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    if (error instanceof AppError) throw error;
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const CategoryServices = {
  addCategory,
};
