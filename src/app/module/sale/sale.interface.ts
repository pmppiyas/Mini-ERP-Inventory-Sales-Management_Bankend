import { Document, Types } from 'mongoose';

export interface ISale {
  sellerId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISaleResponse {
  _id: string;
  sellerId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  sellingPrice: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateSalePayload {
  productId: string;
  quantity: number;
}
export interface ISaleDocument extends ISale, Document {}
