import { Router } from "express";
import validationRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";
import { orderValidation } from "./order.validation"; 
import { orderController } from "./order.controller";

const router = Router();


router.get('/verify',auth(USER_ROLE.customer),orderController.verifyPayment);

router.post(
  "/create-order",
  auth(USER_ROLE.customer), 
  validationRequest(orderValidation.createOrderValidationSchema),
  orderController.createOrder
);


router.get(
  "/",
  auth(USER_ROLE.admin), 
  orderController.getAllOrders 
);


router.get(
  "/my-orders",
  auth(USER_ROLE.customer), 
  orderController.getMyOrder
);


router.get(
  "/:orderId",
  auth(USER_ROLE.admin,USER_ROLE.customer),
  orderController.getSingleOrder
);





router.patch(
  "/:orderId",
  auth(USER_ROLE.admin), 
  validationRequest(orderValidation.updateOrderValidationSchema),
  orderController.updateOrderStatus
);



router.patch(
  "/:orderId/soft-delete",
  auth(USER_ROLE.admin,USER_ROLE.customer),
  orderController.deleteOrder 
);


export const orderRoutes = router;
