import { Request, Response } from 'express';
import config from '../../config';
import { Order } from './order.interface';
import { orderServices } from './order.services';
import { productServices } from '../products/product.services';

const createOrder = async (req: Request, res: Response) => {
  try {
    const order: Order = req.body;
    const OrderQuantity = order.quantity;
    const productId = order.product;
    const orderedProduct =
      await productServices.getASingleProductFromDB(productId);
    if (!orderedProduct) {
       res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }
    const orderedProductQuantity = orderedProduct?.quantity;

    const orderProductUpdatedQuantity =
      (orderedProductQuantity as number) - OrderQuantity;

    if (orderedProductQuantity === 0) {
      res.status(400).json({
        status: false,
        message: 'No product available in the stock',
      });
    }

    if (orderProductUpdatedQuantity < 0) {
      res.status(400).json({
        status: false,
        message: 'Not enough product in stock',
        available: `the number of available product is ${orderedProductQuantity}`,
      });
    }

    await productServices.updateProductFromDB(productId, {
      quantity: orderProductUpdatedQuantity,
      inStock: orderProductUpdatedQuantity === 0 ? false : true,
    });

    const saveOrder = await orderServices.createOrderToDB(order);

    res.status(200).json({
      message: 'Order created successfully',
      status: true,
      data: saveOrder,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: 'Validation failed',
      status: false,
      error: error,
      stack: config.node_env === 'development' && error instanceof Error ? error.stack : undefined,
    });
  }
};

const totalRevenue = async (req: Request, res: Response) => {
  try {
    const result = await orderServices.totalRevenueFromDB();
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: {
        totalRevenue: result,
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: 'something went wrong',
      status: false,
      error: error,
      stack: config.node_env === 'development' && error instanceof Error ? error.stack : undefined,
    });
  }
};

export const orderControllers = {
  createOrder,
  totalRevenue,
};
