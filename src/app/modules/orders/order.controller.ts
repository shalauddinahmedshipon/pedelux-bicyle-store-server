import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderService } from "./order.services";


const createOrder = catchAsync(async (req, res) => {
  const userId = req.user.id; 
  const result = await orderService.createOrderIntoDB(userId, req.body,req.ip!);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Order created successfully",
    data: result,
  });
});


const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Order verified successfully",
    data: order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const { data, meta } = await orderService.getAllOrdersFromDB(
    Number(page) || 1,
    Number(limit) || 10,
    filters
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "All orders retrieved successfully",
    data,
    meta,
  });
});

const getMyOrder = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await orderService.getMyOrdersFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderService.getSingleOrderFromDB(orderId,req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const cancelOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const {id:userId}=req.user;
  const result = await orderService.cancelMyOrderInDB(orderId,userId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const result = await orderService.updateOrderStatusInDB(orderId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

const getSalesDashboard = catchAsync(async (req, res) => {
  const result = await orderService.getSalesDashboard();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order retrieved successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await orderService.deleteOrderFromDB(orderId,req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Order deleted successfully",
    data: result,
  });
});



export const orderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  getMyOrder,
  verifyPayment,
  cancelOrder,
  getSalesDashboard
};
