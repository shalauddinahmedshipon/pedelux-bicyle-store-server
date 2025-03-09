import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import bcrypt from "bcrypt";
import config from "../../config";


const userSchema = new Schema<TUser,UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true , select: 0},
    passwordChangedAt: { type: Date, default: null },
    status: { type: String, enum: ["active", "deactivated"], default: "active" },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    isDeleted:{type:Boolean,default:false}
  },
  {
    timestamps: true,
  }
);


userSchema.pre('save', async function (next) {
  const isUserExist = await User.findOne({ email: this.email });
  if (isUserExist) {
    throw new AppError(StatusCodes.CONFLICT, 'This User is already Exist!');
  }
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_solt));
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});



userSchema.statics.isUserExistByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};
userSchema.statics.isUserDeactivated = async function (status: string) {
  return status === 'deactivated';
};
userSchema.statics.isPasswordMatch = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};




const User = model<TUser,UserModel>("User", userSchema);

export default User;
