import { Document, Types } from 'mongoose';

export interface IProduct {
  productData: import('mongoose').Schema.Types.ObjectId;
  name: string;
  sku: string;
  category: Types.ObjectId;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  productImage?: string;
  createdBy: Types.ObjectId;
}

export interface IProductResponse {
  _id: string;
  name: string;
  sku: string;
  category: Types.ObjectId;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  productImage?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document {
  createdAt: Date;
  updatedAt: Date;
}
