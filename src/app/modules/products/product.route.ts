import { Router } from "express";
import validationRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";
import { productValidation } from "./product.validation";
import { productController } from "./product.controller";


const router = Router();

router.post(
  "/create-product",
  auth(USER_ROLE.admin),
  validationRequest(productValidation.createProductValidationSchema),
  productController.createProduct
);

router.get("/", productController.getAllProducts);

router.get("/:productId", productController.getSingleProduct);

router.patch(
  "/:productId",
  auth(USER_ROLE.admin),
  validationRequest(productValidation.updateProductValidationSchema),
  productController.updateProduct
);

router.delete(
  "/:productId",
  auth(USER_ROLE.admin),
  productController.deleteProduct
);

export const productRoutes = router;
