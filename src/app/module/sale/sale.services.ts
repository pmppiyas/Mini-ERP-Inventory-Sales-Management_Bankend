import { IJwtPayload } from '../../interface';
import { ICreateSalePayload, ISale, ISaleResponse } from './sale.interface';
import { Product } from '../product/product.model';
import { Sale } from './sale.model';
import { QueryBuilder } from '../../utils/queryBuilder';

const createSale = async (
  seller: IJwtPayload,
  products: ICreateSalePayload[]
) => {
  const sales = [];

  for (const item of products) {
    const product = await Product.findById(item.id);

    if (!product) {
      throw new Error(`Product not found: ${item.id}`);
    }

    if (product.stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const totalAmount = item.quantity * item.sellingPrice;

    const sale = await Sale.create({
      sellerId: seller.userId,
      productId: product._id,
      quantity: item.quantity,
      sellingPrice: item.sellingPrice,
      totalAmount,
    });

    await Product.findByIdAndUpdate(product._id, {
      $inc: {
        stockQuantity: -item.quantity,
      },
    });

    sales.push(sale);
  }

  return sales;
};

const getSales = async (query: Record<string, string> = {}) => {
  const queryBuilder = new QueryBuilder<ISale>(Sale.find(), query)
    .filter()
    .dateRange('createdAt')
    .sort()
    .fields()
    .paginate()
    .populate([
      {
        path: 'sellerId',
        select: 'name email photoUrl',
      },
      {
        path: 'productId',
        select: '_id name photoUrl sellingPrice',
      },
    ]);

  const [data, meta] = await Promise.all([
    queryBuilder.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    sales: data as unknown as ISaleResponse[],
    meta,
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
