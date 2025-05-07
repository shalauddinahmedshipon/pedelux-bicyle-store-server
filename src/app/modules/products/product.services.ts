/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Product from './product.model';
import { IProduct } from './product.interface';
import { Category } from '../category/category.model';

const createProductIntoDB = async (payload: IProduct) => {
  const isProductIsExist = await Product.findOne({ name: payload.name });
  if (isProductIsExist) {
    throw new AppError(StatusCodes.CONFLICT, 'The product is already exist!');
  }
  const product = await Product.create(payload);
  return product;
};

const getAllProductsFromDB = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: any,
) => {
  const query: any = { isDeleted: false };
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { brand: new RegExp(search, 'i') },
      { model: new RegExp(search, 'i') },
    ];
  }

  if (filters) {
    if (filters.price) {
      query.price = {};
      if (filters.price.gte) query.price.$gte = Number(filters.price.gte);
      if (filters.price.lte) query.price.$lte = Number(filters.price.lte);
    }

    if (filters.stock) {
      query.stock = {};
      if (filters.stock.gte) query.stock.$gte = Number(filters.stock.gte);
      if (filters.stock.lte) query.stock.$lte = Number(filters.stock.lte);
    }

    if (filters.category) {
      query.category = filters.category;
    }

    Object.keys(filters).forEach((key) => {
      if (
        !['price', 'stock', 'category', 'sort'].includes(key) &&
        filters[key]
      ) {
        query[key] = filters[key];
      }
    });
  }

  let sortQuery: any = {};
  if (filters?.sort) {
    if (filters.sort === 'priceAsc') {
      sortQuery = { price: 1 }; // Low to High
    } else if (filters.sort === 'priceDesc') {
      sortQuery = { price: -1 }; // High to Low
    } else if (filters.sort === 'newest') {
      sortQuery = { createdAt: -1 }; // Newest First
    } else if (filters.sort === 'oldest') {
      sortQuery = { createdAt: 1 }; // Oldest First
    } else if (filters.sort === 'stockAsc') {
      sortQuery = { stock: 1 }; // Low stock first
    } else if (filters.sort === 'stockDesc') {
      sortQuery = { stock: -1 }; // High stock first
    }
  }

  const skip = (page - 1) * limit;
  const filterQuery = Product.find(query);
  const data = await filterQuery
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .populate('category');
  const total = await Product.countDocuments(query);
  const totalPage = Math.ceil(total / limit);
  return {
    data,
    meta: {
      limit,
      page,
      total,
      totalPage,
    },
  };
};

const getSingleProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId).populate('category');
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  if (product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  return product;
};

const updateProductInDB = async (
  productId: string,
  updateData: Partial<IProduct>,
) => {
  const isProductIsExist = await Product.findById(productId);

  if (!isProductIsExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  if (isProductIsExist.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  if (updateData.category) {
    const isCategoryExist = await Category.findById(updateData.category);
    if (!isCategoryExist) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Category does not exist');
    }
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedProduct;
};

const deleteProductFromDB = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }
  if (product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const deletedProduct = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true },
  );
  return deletedProduct;
};

// const changeProductStockFromDB = async (productId: string, quantity: number) => {
//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
//   }
//   if (product.isDeleted) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
//   }
//   if (product.stock < quantity) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient stock");
//   }

//   product.stock -= quantity;
//   await product.save();
//   return product;
// };

export const productService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductFromDB,
  // changeProductStockFromDB,
};
