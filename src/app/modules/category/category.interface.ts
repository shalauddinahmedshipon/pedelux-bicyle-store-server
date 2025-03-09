import { Types } from "mongoose";

export interface TCategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  isDeleted:boolean
  createdAt?: Date;
  updatedAt?: Date;
}




