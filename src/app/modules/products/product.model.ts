import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String,unique:true, required: [true, "Product name is required"] },
    brand: { type: String, required: [true, "Brand is required"] },
    model: { type: String, required: [true, "Model is required"] },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", 
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    isDeleted:{type:Boolean,default:false},
    description: { type: String, default: "" },
    imageUrl: { type: String, required: [true, "Image URL is required"] },
  },
  { timestamps: true }
);


const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;