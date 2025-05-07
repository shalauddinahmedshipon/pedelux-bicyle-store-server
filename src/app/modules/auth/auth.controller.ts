import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);

  const { accessToken } = result;

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User login successfully',
    data: {
      accessToken,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userData = req.user;
  const passwordData = req.body;
  const result = await authServices.changePasswordIntoDB(
    userData,
    passwordData,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Password is changed successfully',
    data: result,
  });
});

export const authControllers = {
  loginUser,
  changePassword,
};
