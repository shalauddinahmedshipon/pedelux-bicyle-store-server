import { Bicycle } from './product.interface';
import { Product } from './product.model';

const createProductToDB = async (product: Bicycle) => {
  const result = await Product.create(product);
  return result;
};
const getAllProductsFromDB = async (query: object) => {
  const result = await Product.find(query).exec();
  return result;
};
const getASingleProductFromDB = async (productId: string) => {
  const result = await Product.findById(productId);
  return result;
};
const updateProductFromDB = async (productId: string, updateFields: object) => {
  const result = await Product.findByIdAndUpdate(productId, updateFields, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProductFromDB = async (productId: string) => {
  const result = await Product.findByIdAndDelete(productId);
  return result;
};

export const productServices = {
  createProductToDB,
  getAllProductsFromDB,
  getASingleProductFromDB,
  updateProductFromDB,
  deleteProductFromDB,
};
