import { Document, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';

export interface IProduct {
  productData: import('mongoose').Schema.Types.ObjectId;
  name: string;
  sku: string;
  category: ICategory;
  purchasePrice: number;
  SellingPrice: number;
  stockQuantity: number;
  photoUrl?: string;
  createdBy: Types.ObjectId;
}

export interface IProductResponse {
  _id: string;
  name: string;
  sku: string;
  category: ICategory;
  purchasePrice: number;
  SellingPrice: number;
  stockQuantity: number;
  photoUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document {
  createdAt: Date;
  updatedAt: Date;
}
