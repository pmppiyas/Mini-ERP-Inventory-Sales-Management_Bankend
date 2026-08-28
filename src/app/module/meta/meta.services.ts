import { User } from '../user/user.model';
import { Product } from '../product/product.model';
import { Category } from '../category/category.model';
import { Sale } from '../sale/sale.model';
import { Role } from '../user/user,interface';

// ── Utility: fill missing days with 0 so chart has no gaps ─────────────────
const fillChartGaps = (
  data: { date: string; totalSales: number; totalRevenue: number }[],
  days: number = 7
) => {
  const map = new Map(data.map((d) => [d.date, d]));
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    result.push(
      map.get(dateStr) ?? { date: dateStr, totalSales: 0, totalRevenue: 0 }
    );
  }

  return result;
};

const getMeta = async (role: Role) => {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayEnd = new Date(now);
  todayEnd.setUTCHours(23, 59, 59, 999);

  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - now.getUTCDay());
  weekStart.setUTCHours(0, 0, 0, 0);

  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  );

  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  const last7DaysStart = new Date(now);
  last7DaysStart.setUTCDate(now.getUTCDate() - 6);
  last7DaysStart.setUTCHours(0, 0, 0, 0);

  const [
    totalProducts,
    totalCategories,
    totalEmployees,
    totalSales,
    lowStockProducts,
    outOfStockCount,
    totalRevenueAgg,
    todayStatsAgg,
    weekRevenueAgg,
    monthRevenueAgg,
    yearRevenueAgg,
    salesChartAgg,
    recentSales,
    topSellingAgg,
    employeePerformanceAgg,
  ] = await Promise.all([
    // 1. Total Products
    Product.countDocuments(),

    // 2. Total Categories
    Category.countDocuments(),

    // 3. Total Employees
    User.countDocuments({ role: Role.EMPLOYEE }),

    // 4. Total Sales count
    Sale.countDocuments(),

    // 5. Low stock products (stockQuantity <= 5, > 0)
    Product.find({ stockQuantity: { $gt: 0, $lte: 5 } })
      .select('name sku stockQuantity')
      .lean(),

    // 6. Out of stock count
    Product.countDocuments({ stockQuantity: 0 }),

    // 7. Total Revenue (all time)
    Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // 8. Today's sales count + revenue
    Sale.aggregate([
      { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]),

    // 9. This week revenue
    Sale.aggregate([
      { $match: { createdAt: { $gte: weekStart, $lte: todayEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // 10. This month revenue
    Sale.aggregate([
      { $match: { createdAt: { $gte: monthStart, $lte: todayEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // 11. This year revenue
    Sale.aggregate([
      { $match: { createdAt: { $gte: yearStart, $lte: todayEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),

    // 12. Sales chart — last 7 days
    Sale.aggregate([
      { $match: { createdAt: { $gte: last7DaysStart, $lte: todayEnd } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalSales: 1,
          totalRevenue: 1,
        },
      },
    ]),

    // 13. Recent 10 sales
    Sale.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: 'productId', select: 'name' })
      .populate({ path: 'sellerId', select: 'name' })
      .select('productId sellerId quantity sellingPrice totalAmount createdAt')
      .lean(),

    // 14. Top 5 selling products
    Sale.aggregate([
      {
        $group: {
          _id: '$productId',
          totalQuantitySold: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productName: '$product.name',
          totalQuantitySold: 1,
          totalRevenue: 1,
        },
      },
    ]),

    // 15. Employee performance — top sellers
    Sale.aggregate([
      {
        $group: {
          _id: '$sellerId',
          numberOfSales: { $sum: 1 },
          revenueGenerated: { $sum: '$totalAmount' },
        },
      },
      { $sort: { revenueGenerated: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          employeeName: '$employee.name',
          numberOfSales: 1,
          revenueGenerated: 1,
        },
      },
    ]),
  ]);

  // ── Shape the response ─────────────────────────────────────────────────────
  return {
    summary: {
      totalProducts,
      totalCategories,
      totalEmployees,
      totalSales,
      totalRevenue: totalRevenueAgg[0]?.total ?? 0,
      todaySales: todayStatsAgg[0]?.totalSales ?? 0,
      todayRevenue: todayStatsAgg[0]?.totalRevenue ?? 0,
      lowStockProductsCount: lowStockProducts.length,
      outOfStockProductsCount: outOfStockCount,
    },

    salesAnalytics: {
      todayRevenue: todayStatsAgg[0]?.totalRevenue ?? 0,
      thisWeekRevenue: weekRevenueAgg[0]?.total ?? 0,
      thisMonthRevenue: monthRevenueAgg[0]?.total ?? 0,
      thisYearRevenue: yearRevenueAgg[0]?.total ?? 0,
    },

    salesChart: fillChartGaps(salesChartAgg),

    recentSales: recentSales.map((sale: any) => ({
      productName: sale.productId?.name ?? 'N/A',
      sellerName: sale.sellerId?.name ?? 'N/A',
      quantity: sale.quantity,
      sellingPrice: sale.sellingPrice,
      totalAmount: sale.totalAmount,
      createdAt: sale.createdAt,
    })),

    lowStockProducts: lowStockProducts.map((p: any) => ({
      productName: p.name,
      sku: p.sku,
      currentStock: p.stockQuantity,
    })),

    topSellingProducts: topSellingAgg,

    employeePerformance: employeePerformanceAgg,
  };
};

export const MetaServices = {
  getMeta,
};
