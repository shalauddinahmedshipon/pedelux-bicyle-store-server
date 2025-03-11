import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import Order from "./order.model";
import { IOrder } from "./order.interface"; 
import User from "../users/user.model";
import Product from "../products/product.model";
import { orderStatuses } from "./order.constant";
import mongoose from "mongoose";


const createOrderIntoDB = async (userId: string, payload: IOrder) => {
  const session = await mongoose.startSession(); 
  session.startTransaction(); 

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    for (const product of payload.products) {
      const productInDB = await Product.findById(product.bicycle).session(session);
      if (!productInDB) {
        throw new AppError(StatusCodes.NOT_FOUND, `Product with ID ${product.bicycle} not found`);
      }

      if (productInDB.stock < product.quantity) {
        throw new AppError(StatusCodes.BAD_REQUEST, `Insufficient stock for ${productInDB.name}`);
      }
    }

    const order = await Order.create(
      [
        {
          user: userId,
          products: payload.products,
          totalPrice: payload.totalPrice,
          status: "pending",
          paymentMethod: payload.paymentMethod,
          paymentStatus: "pending",
          shippingAddress: payload.shippingAddress,
        },
      ],
      { session }
    );

    
    for (const product of payload.products) {
      const productInDB = await Product.findById(product.bicycle).session(session);
      if (productInDB) {
        productInDB.stock -= product.quantity;
        await productInDB.save({ session });
      }
    }

    
    await session.commitTransaction();
    session.endSession();

    return order[0]; 
  } catch (error) {
    await session.abortTransaction(); 
    session.endSession();
    throw error;
  }
};


const getAllOrdersFromDB = async (page: number = 1, limit: number = 10, filters?: any) => {
  const query: any = {}; 

  if (filters) {
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.paymentStatus) {
      query.paymentStatus = filters.paymentStatus;
    }

    if (filters.user) {
      query.user = filters.user;
    }
  }

  const skip = (page - 1) * limit;
  const data = await Order.find(query)
    .skip(skip)
    .limit(limit)
    .populate("user")
    .populate("products.bicycle");
  
  const total = await Order.countDocuments(query);
  const totalPage = Math.ceil(total / limit);
  return {
  data,
  meta:{
  limit,
  page,
  total,
  totalPage
  }
  };
};


const getSingleOrderFromDB = async (orderId: string) => {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate("products.bicycle");

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  return order;
};


const updateOrderStatusInDB = async (orderId: string, status: string) => {
 
  if (!orderStatuses.includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid order status");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  order.status = status;
  await order.save();

  return order;
};




const deleteOrderFromDB = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  const deletedOrder = await Order.findByIdAndDelete(orderId);
  return deletedOrder;
};


const changeProductStockOnOrderCancel = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  if (order.status !== "cancelled") {
    throw new AppError(StatusCodes.BAD_REQUEST, "Only cancelled orders can restore stock");
  }

  for (const product of order.products) {
    const productInDB = await Product.findById(product.bicycle);
    if (productInDB) {
      productInDB.stock += product.quantity;
      await productInDB.save();
    }
  }

  return { message: "Product stock has been restored" };
};

export const orderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusInDB,
  deleteOrderFromDB,
  changeProductStockOnOrderCancel,
};
