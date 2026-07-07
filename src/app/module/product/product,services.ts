import { IProduct, IProductResponse } from './product.interface';
import { Product } from './product.model';
import { AppError } from '../../error/appError';
import httpStatus from 'http-status-codes';
import { ObjectId, Types } from 'mongoose';

const addProduct = async (
  productData: IProduct,
  createdBy: Types.ObjectId
): Promise<IProductResponse> => {
  const isProductExist = await Product.findOne({
    sku: productData.sku,
  });

  if (isProductExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Product with this SKU already exists'
    );
  }

  productData.createdBy = createdBy as Types.ObjectId;

  const product = await Product.create(productData);

  return {
    _id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    category: product.category,
    purchasePrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    stockQuantity: product.stockQuantity,
    productImage: product.productImage,
    createdBy: product.createdBy.toString(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const ProductService = {
  addProduct,
};
