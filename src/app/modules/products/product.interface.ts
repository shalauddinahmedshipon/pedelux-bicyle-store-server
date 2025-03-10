import { Types } from "mongoose";



export interface IProduct  {
  name: string;
  brand: string;
  model: string;
  category: Types.ObjectId;
  price: number;
  stock: number;
  description?: string;
  imageUrl: string;
  isDeleted?:boolean
  createdAt?: Date;
  updatedAt?: Date;
}