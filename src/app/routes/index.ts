import { Router } from 'express';
import { productRoutes } from '../modules/products/product.route';
import { orderRoutes } from '../modules/orders/order.route';
import { userRoutes } from '../modules/users/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { categoryRoutes } from '../modules/category/category.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/products',
    route: productRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
