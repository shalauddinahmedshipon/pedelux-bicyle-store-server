import mongoose, { Document } from "mongoose";


export interface IProduct extends Document {
  name: string;
  brand: string;
  model: string;
  category: mongoose.Schema.Types.ObjectId;
  price: number;
  stock: number;
  description?: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}