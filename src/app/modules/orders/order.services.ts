import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { IOrder } from "./order.interface"; 
import User from "../users/user.model";
import Product from "../products/product.model";
import { orderStatuses } from "./order.constant";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { orderUtils } from "./order.utils";
import Order from "./order.model";


const createOrderIntoDB = async (userId: string, payload: IOrder,client_ip:string) => {
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

    let order = await Order.create(
      [
        {
          user: userId,
          products: payload.products,
          totalPrice: payload.totalPrice,
          phoneNumber:payload.phoneNumber,
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

  // payment integration
  const shurjopayPayload = {
    amount: payload.totalPrice,
    order_id: order[0]._id,
    currency: "BDT",
    customer_name: user.name,
    customer_address: payload.shippingAddress.street,
    customer_post_code:payload.shippingAddress.zipCode,
    customer_city: payload.shippingAddress.city,
    customer_state: payload.shippingAddress.state,
    customer_country:payload.shippingAddress.country,
    customer_email: user.email,
    customer_phone: payload.phoneNumber,
    client_ip,
  };

  await session.commitTransaction();
  session.endSession();

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);
  if (payment?.transactionStatus) {
    order = await order[0].updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

console.log(payment)
 
  return payment?.checkout_url
  } catch (error) {
    await session.abortTransaction(); 
    session.endSession();
    throw error;
  }
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        "transaction.id": order_id,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        paymentStatus:
          verifiedPayment[0].bank_status == "Success"
            ? "paid"
            : verifiedPayment[0].bank_status == "Failed"
            ? "pending"
            : verifiedPayment[0].bank_status == "Cancel"
            ? "cancel"
            : "",
      }
    );
  }

  return verifiedPayment;
};




const getAllOrdersFromDB = async (page: number = 1, limit: number = 10, filters?: any) => {
  const query: any = {isDeleted:false}; 

  if (filters) {
    if (filters.status) {
      query.status = filters.status;
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

const getMyOrdersFromDB = async (userId:string) => {
  const result = await Order.find({user:userId,isDeleted:false})
    .populate("user")
    .populate("products.bicycle");
  
return result
};


const getSingleOrderFromDB = async (orderId: string,payload:JwtPayload) => {

  const order = await Order.findById(orderId)
    .populate("products.bicycle");

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }
  if (order.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }
 if(payload.role === "customer" && order?.user!.toString() !== payload.id){
  throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
 }
  return order;
};


const updateOrderStatusInDB = async (orderId: string, status: string) => {
 
  if (!orderStatuses.includes(status)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid order status");
  }

  const order = await Order.findById(orderId).populate('products.bicycle');
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }
  if (order.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }
  if(order.status==="cancelled"){
    throw new AppError(StatusCodes.BAD_REQUEST,"The order is already cancelled")
  }
  if (status === "cancelled") {
    for (const product of order.products) {
      const productInDB = await Product.findById(product.bicycle);
      if (productInDB) {
        productInDB.stock += product.quantity;
        await productInDB.save();
      }
    }
  }
  order.status = status;
  (await order.save());

  return order;
};




const deleteOrderFromDB = async (orderId: string,payload:JwtPayload) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }
  if(order.isDeleted){
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }
  console.log(payload.role,order.user,payload.id)
  if(payload.role === "customer" && order?.user!.toString() !== payload.id){
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
   }

  const deletedOrder = await Order.findByIdAndUpdate(orderId,{isDeleted:true},{new:true});
  return deletedOrder;
};




export const orderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusInDB,
  deleteOrderFromDB,
  getMyOrdersFromDB,
  verifyPayment

};
