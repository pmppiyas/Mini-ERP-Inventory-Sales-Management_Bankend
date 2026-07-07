import { IProduct, IProductResponse } from './product.interface';
import { Product } from './product.model';
import { AppError } from '../../error/appError';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import { IJwtPayload } from '../../interface';

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

const updateProduct = async (
  productId: string,
  productData: Partial<IProduct>,
  updater: IJwtPayload
): Promise<IProductResponse> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }

  const isProductExist = await Product.findById(productId);

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (productData.sku) {
    const isSkuExist = await Product.findOne({
      sku: productData.sku,
      _id: { $ne: productId },
    });

    if (isSkuExist) {
      throw new AppError(httpStatus.CONFLICT, 'SKU already exists');
    }
  }

  productData.createdBy = new Types.ObjectId(updater.userId) as Types.ObjectId;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    productData,
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return {
    _id: updatedProduct._id.toString(),
    name: updatedProduct.name,
    sku: updatedProduct.sku,
    category: updatedProduct.category,
    purchasePrice: updatedProduct.purchasePrice,
    sellingPrice: updatedProduct.sellingPrice,
    stockQuantity: updatedProduct.stockQuantity,
    productImage: updatedProduct.productImage,
    createdBy: updatedProduct.createdBy.toString(),
    createdAt: updatedProduct.createdAt,
    updatedAt: updatedProduct.updatedAt,
  };
};

export const ProductService = {
  addProduct,
  updateProduct,
};
