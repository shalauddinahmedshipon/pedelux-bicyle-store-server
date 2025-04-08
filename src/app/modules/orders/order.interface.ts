import { Types } from "mongoose";


export interface IOrder {
  user: Types.ObjectId; 
  products: Array<{ 
    bicycle: Types.ObjectId;
    quantity: number; 
    price: number; 
  }>;
  phoneNumber:string;
  totalPrice: number; 
  status: 'pending' | 'shipped' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'cancel' | 'paid';
  paymentMethod: string; 
  surjoPayTransactionId?: string; 
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
  isDeleted:boolean;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
