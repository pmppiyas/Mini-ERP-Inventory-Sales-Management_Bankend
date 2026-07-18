import { IJwtPayload } from '../../interface';
import { ICreateSalePayload } from './sell.interface';
import { Product } from '../product/product.model';
import { Sale } from './sale.model';

const createSell = async (
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

export const SellServices = {
  createSell,
};
