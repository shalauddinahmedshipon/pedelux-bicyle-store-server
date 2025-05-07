/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import AppError from '../error/AppError';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/users/user.interface';
import User from '../modules/users/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
    }
    const { email, role, iat } = decoded;

    const user = await User.isUserExistByEmail(email);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User is not Exist');
    }
    if (user.isDeleted === true) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist');
    }
    if (await User.isUserDeactivated(user.status!)) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'User is Deactivated!');
    }

    if (
      user.passwordChangedAt &&
      (await User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      ))
    ) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not Authorized!');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
