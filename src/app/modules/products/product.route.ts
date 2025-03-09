import express from 'express';
import { productController } from './product.controller';
const router = express.Router();

router.post('/create-product', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getASingleProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

export const productRoutes = router;
