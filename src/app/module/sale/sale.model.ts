import { Schema, model, Types } from 'mongoose';
import { ISaleDocument } from './sale.interface';

const saleSchema = new Schema<ISaleDocument>(
  {
    sellerId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    productId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Sale = model<ISaleDocument>('Sale', saleSchema);
