import express from 'express';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  authControllers.loginUser,
);
router.post(
  '/change-password',
  auth(USER_ROLE.admin,USER_ROLE.customer),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);


export const authRoutes = router;
