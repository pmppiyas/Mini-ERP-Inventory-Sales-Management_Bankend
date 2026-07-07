import { ICategory } from '../../module/category/category.interface';
import { model, Schema, Types } from 'mongoose';

const categorySchema = new Schema<ICategory>(
  {
    _id: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    parentId: {
      type: Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    versionKey: false,
  }
);

export const Category = model<ICategory>('Category', categorySchema);
