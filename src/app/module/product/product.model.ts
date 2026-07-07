import { Schema, model, Types } from 'mongoose';
import { IProductDocument } from './product.interface';

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    productImage: {
      type: String,
    },

    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({
  name: 'text',
  sku: 'text',
  category: 'text',
});

export const Product = model<IProductDocument>('Product', productSchema);
