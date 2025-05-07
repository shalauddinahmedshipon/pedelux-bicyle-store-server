/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import User from './user.model';
import { JwtPayload } from 'jsonwebtoken';
import { createToken } from '../auth/auth.utils';
import config from '../../config';

const registerUserIntoDB = async (payload: TUser) => {
  const user = await User.create(payload);
  const jwtPayload = {
    email: user.email,
    role: user.role!,
    id: user._id,
  };
  
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.access_token_expiresIn as string,
  );

  return {
    user,
    accessToken,
  };
};

const getAllUserFromDB = async (
  page: number = 1,
  limit: number = 10,
  filters?: any,
) => {
  const query: any = { isDeleted: false };

  if (filters) {
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.role) {
      query.role = filters.role;
    }
  }

  const skip = (page - 1) * limit;
  const data = await User.find(query).skip(skip).limit(limit);

  const total = await User.countDocuments(query);
  const totalPage = Math.ceil(total / limit);
  return {
    data,
    meta: {
      limit,
      page,
      total,
      totalPage,
    },
  };
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (user.isDeleted === true) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  return user;
};

const getMyProfileFromDB = async (email: string, role: string) => {
  const user = await User.findOne({ email, role });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (user.isDeleted === true) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  return user;
};

const changeStatusFromDB = async (
  status: 'active' | 'deactivated',
  userId: string,
  payload: JwtPayload,
) => {
  const { email } = payload;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (user.isDeleted === true) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (email === user.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User can not change his own status!',
    );
  }
  if (user.status === status) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User status is already ${status}!`,
    );
  }
  const result = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true },
  );
  return result;
};

const updateProfile = async (userId: string, name: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (user.isDeleted === true) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (await User.isUserDeactivated(user.status!)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Deactivated!');
  }
  const result = await User.findByIdAndUpdate(userId, { name }, { new: true });
  return result;
};

const updateUserRole = async (
  userId: string,
  role: 'customer' | 'admin',
  payload: JwtPayload,
) => {
  const { email } = payload;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (user.isDeleted === true) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (await User.isUserDeactivated(user.status!)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is Deactivated!');
  }
  if (email === user.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User can not change his own role!',
    );
  }
  if (user.role === role) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `User role is already ${role}!`,
    );
  }
  const result = await User.findByIdAndUpdate(userId, { role }, { new: true });
  return result;
};

const deleteUserFromDB = async (userId: string, payload: JwtPayload) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (isUserExist.isDeleted === true) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
  }
  if (isUserExist.email === payload?.email) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'User can not delete his own account!',
    );
  }
  const result = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const userService = {
  getAllUserFromDB,
  registerUserIntoDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  getMyProfileFromDB,
  changeStatusFromDB,
  updateUserRole,
  updateProfile,
};
