import { Order } from './order.interface';
import { OrderModel } from './order.model';

const createOrderToDB = async (order: Order) => {
  const result = await OrderModel.create(order);
  return result;
};

const totalRevenueFromDB = async () => {
  const revenueData = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ]);

  const total = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
  return total;
};

export const orderServices = {
  createOrderToDB,
  totalRevenueFromDB,
};
