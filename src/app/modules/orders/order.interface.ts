import { Types } from "mongoose";


export interface IOrder {
  // _id?:Types.ObjectId;
  user: Types.ObjectId; 
  products: Array<{ 
    bicycle: Types.ObjectId;
    quantity: number; 
    price: number; 
  }>;
  phoneNumber:string;
  totalPrice: number; 
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  paymentMethod: string; 
  paymentStatus: 'paid' | 'pending' | 'failed'; 
  surjoPayTransactionId?: string; 
  isDeleted:boolean;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
