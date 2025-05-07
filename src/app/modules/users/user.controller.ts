import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userService } from './user.service';

const registerUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await userService.registerUserIntoDB(userData);
  const { accessToken, user } = result;
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User Register successfully',
    data: {
      accessToken,
      user,
    },
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const { page, limit, ...filters } = req.query;
  const { data, meta } = await userService.getAllUserFromDB(
    Number(page) || 1,
    Number(limit) || 10,
    filters,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'All users retrieved successfully',
    data,
    meta,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userService.getSingleUserFromDB(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User retrieves successfully',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await userService.getMyProfileFromDB(email, role);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'User own Profile information retrieve successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { userId, status } = req.body;
  const payload = req.user;
  const result = await userService.changeStatusFromDB(status, userId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Update user status successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user;
  const result = await userService.updateProfile(userId, name);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Update user profile successfully',
    data: result,
  });
});
const updateRole = catchAsync(async (req, res) => {
  const { userId, role } = req.body;
  const payload = req.user;
  const result = await userService.updateUserRole(userId, role, payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Update user role successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await userService.deleteUserFromDB(userId, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userController = {
  getAllUser,
  registerUser,
  deleteUser,
  changeStatus,
  updateRole,
  getMyProfile,
  getSingleUser,
  updateProfile,
};
