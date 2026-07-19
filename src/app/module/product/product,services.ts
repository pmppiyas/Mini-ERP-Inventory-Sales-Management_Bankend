import { IProduct, IProductResponse } from './product.interface';
import { Product } from './product.model';
import { AppError } from '../../error/appError';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import { IJwtPayload } from '../../interface';
import { QueryBuilder } from '../../utils/queryBuilder';
import { Category } from '../category/category.model';

const addProduct = async (
  productData: IProduct,
  createdBy: Types.ObjectId
): Promise<IProductResponse> => {
  console.log(productData);

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
    SellingPrice: product.SellingPrice,
    stockQuantity: product.stockQuantity,
    photoUrl: product.photoUrl,
    createdBy: product.createdBy.toString(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const getProductById = async (productId: string): Promise<IProductResponse> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }

  const product = await Product.findById(productId).populate([
    {
      path: 'category',
      select: 'name slug',
    },
  ]);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return {
    _id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    category: product.category,
    purchasePrice: product.purchasePrice,
    SellingPrice: product.SellingPrice,
    stockQuantity: product.stockQuantity,
    photoUrl: product.photoUrl,
    createdBy: product.createdBy.toString(),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const allProducts = async (
  query: Record<string, string> = {}
): Promise<{ products: IProductResponse[]; meta: any }> => {
  if (query.category) {
    const category = await Category.findOne({
      slug: query.category,
    }).select('_id');

    if (category) {
      query.category = category._id.toString();
    }
  }

  const searchableFields = ['name', 'sku', 'category'];

  const queryBuilder = new QueryBuilder<IProduct>(Product.find(), query)
    .filter()
    .search(searchableFields)
    .sort()
    .fields()
    .paginate()
    .populate([
      {
        path: 'category',
        select: 'name slug',
      },
    ]);

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    products: data as unknown as IProductResponse[],
    meta,
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
    SellingPrice: updatedProduct.SellingPrice,
    stockQuantity: updatedProduct.stockQuantity,
    photoUrl: updatedProduct.photoUrl,
    createdBy: updatedProduct.createdBy.toString(),
    createdAt: updatedProduct.createdAt,
    updatedAt: updatedProduct.updatedAt,
  };
};

const deleteProduct = async (
  productId: string,
  deleter: IJwtPayload
): Promise<void> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }

  const isProductExist = await Product.findById(productId);

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  await Product.findByIdAndDelete(productId);
};

export const ProductService = {
  addProduct,
  allProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
