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

export interface ICreateSalePayload {
  id: string;
  quantity: number;
  sellingPrice: number;
}
export interface ISaleDocument extends ISale, Document {}
