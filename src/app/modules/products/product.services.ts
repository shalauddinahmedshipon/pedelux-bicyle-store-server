
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import Product from "./product.model";
import { IProduct } from "./product.interface";

/**
 * Add a new product to the database
 */
const createProductIntoDB = async (payload: IProduct) => {
  const isProductIsExist=await Product.find({name:payload.name});
  if(isProductIsExist){
    throw new AppError(StatusCodes.CONFLICT, "The product is already exist!");
  }
  const product = await Product.create(payload);
  return product;
};

/**
 * Retrieve all products with optional filters and pagination
 */
const getAllProductsFromDB = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: Partial<IProduct>
) => {
  const query: any = {};

  // Apply search (by name, brand, model)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { model: { $regex: search, $options: "i" } },
    ];
  }

  // Apply filters (price range, stock availability, etc.)
  if (filters) {
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof IProduct] !== undefined) {
        query[key] = filters[key as keyof IProduct];
      }
    });
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query).skip(skip).limit(limit);
  const totalProducts = await Product.countDocuments(query);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  };
};

/**
 * Retrieve a single product by ID
 */
const getSingleProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  if (product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  return product;
};

/**
 * Update a product by ID
 */
const updateProductInDB = async (productId: string, updateData: Partial<IProduct>) => {
  const isProductIsExist= await Product.findById(productId);

  if (!isProductIsExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  if (isProductIsExist.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
  return updatedProduct;
};

/**
 * Delete a product (soft delete)
 */
const deleteProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  if (product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  const deletedProduct = await Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true });
  return deletedProduct;
};

/**
 * Change product stock (used when an order is placed)
 */
const changeProductStockFromDB = async (productId: string, quantity: number) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  if (product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }
  if (product.stock < quantity) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient stock");
  }

  product.stock -= quantity;
  await product.save();
  return product;
};

export const productService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductFromDB,
  changeProductStockFromDB,
};
