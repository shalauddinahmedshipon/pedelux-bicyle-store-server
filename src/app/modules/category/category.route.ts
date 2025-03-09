import { Router } from "express";
import validationRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../users/user.constant";
import { categoryController } from "./category.controller";


const router = Router();

router.post(
  "/create-category",
  auth(USER_ROLE.admin),
  validationRequest(categoryValidation.createCategoryValidationSchema),
  categoryController.createCategory
);

router.get("/", categoryController.getAllCategories);

router.get(
  "/:id",
  categoryController.getCategoryById
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validationRequest(categoryValidation.updateCategoryValidationSchema),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  auth( USER_ROLE.admin),
  categoryController.deleteCategory
);

router.patch(
  "/:id/soft-delete",
  auth( USER_ROLE.admin),
  categoryController.softDeleteCategory
);

export const categoryRoutes = router;
