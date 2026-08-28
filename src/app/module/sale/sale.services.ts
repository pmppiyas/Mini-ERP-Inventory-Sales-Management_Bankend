import { IJwtPayload } from '../../interface';
import { ICreateSalePayload, ISale, ISaleResponse } from './sale.interface';
import { Product } from '../product/product.model';
import { Sale } from './sale.model';
import { QueryBuilder } from '../../utils/queryBuilder';
import { AppError } from '../../error/appError';
import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';

const createSale = async (
  seller: IJwtPayload,
  products: ICreateSalePayload[]
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sales = [];

    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product not found: ${item.productId}`
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        );
      }

      const sellingPrice = product.sellingPrice;
      const totalAmount = item.quantity * sellingPrice;

      const [sale] = await Sale.create(
        [
          {
            sellerId: seller.userId,
            productId: product._id,
            quantity: item.quantity,
            sellingPrice,
            totalAmount,
          },
        ],
        { session }
      );

      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stockQuantity: -item.quantity } },
        { session }
      );

      sales.push(sale);
    }

    await session.commitTransaction();
    return sales;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getSales = async (query: Record<string, string> = {}) => {
  const {
    searchTerm,
    fromDate,
    toDate,
    page = '1',
    limit = '12',
    sortBy,
    sort,
  } = query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 12, 1);
  const skip = (pageNum - 1) * limitNum;

  const sortParam = sortBy || sort || 'createdAt';
  const sortField = sortParam.startsWith('-') ? sortParam.slice(1) : sortParam;
  const sortOrder = sortParam.startsWith('-') ? -1 : 1;

  const pipeline: any[] = [
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productId',
      },
    },
    { $unwind: { path: '$productId', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'users',
        localField: 'sellerId',
        foreignField: '_id',
        as: 'sellerId',
      },
    },
    { $unwind: { path: '$sellerId', preserveNullAndEmptyArrays: true } },
  ];

  const dateFilter: Record<string, any> = {};
  if (fromDate) {
    const from = new Date(fromDate);
    from.setUTCHours(0, 0, 0, 0);
    if (!isNaN(from.getTime())) dateFilter['$gte'] = from;
  }
  if (toDate) {
    const to = new Date(toDate);
    to.setUTCHours(23, 59, 59, 999);
    if (!isNaN(to.getTime())) dateFilter['$lte'] = to;
  }
  if (Object.keys(dateFilter).length > 0) {
    pipeline.push({ $match: { createdAt: dateFilter } });
  }

  if (searchTerm?.trim()) {
    pipeline.push({
      $match: {
        $or: [
          { 'productId.name': { $regex: searchTerm.trim(), $options: 'i' } },
          { 'sellerId.name': { $regex: searchTerm.trim(), $options: 'i' } },
        ],
      },
    });
  }

  const countPipeline = [...pipeline, { $count: 'total' }];

  pipeline.push(
    { $sort: { [sortField]: sortOrder } },
    { $skip: skip },
    { $limit: limitNum }
  );

  pipeline.push({
    $project: {
      _id: 1,
      quantity: 1,
      sellingPrice: 1,
      totalAmount: 1,
      createdAt: 1,
      updatedAt: 1,
      'productId._id': 1,
      'productId.name': 1,
      'productId.photoUrl': 1,
      'productId.sellingPrice': 1,
      'sellerId._id': 1,
      'sellerId.name': 1,
      'sellerId.email': 1,
      'sellerId.photoUrl': 1,
    },
  });

  const [data, countResult] = await Promise.all([
    Sale.aggregate(pipeline),
    Sale.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total ?? 0;

  return {
    sales: data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage: Math.ceil(total / limitNum),
    },
  };
};

const getSalebyId = async (id: string) => {
  return await Sale.findById(id).populate([
    { path: 'sellerId', select: '_id name email' },
    {
      path: 'productId',
      select: '_id name photoUrl',
    },
  ]);
};

export const SaleServices = {
  createSale,
  getSales,
  getSalebyId,
};
