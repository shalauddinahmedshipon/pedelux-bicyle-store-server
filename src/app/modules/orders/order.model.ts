import { Schema, model, Types } from "mongoose";
import { orderStatuses, paymentStatus } from "./order.constant";


const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User", 
    },
    products: [
      {
        bicycle: {
          type: Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    isDeleted:{
      type:Boolean,
      default:false
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum:orderStatuses,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatus,
      default: "pending",
    },
    surjoPayTransactionId: {
      type: String,
    },
    shippingAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

export default Order;
