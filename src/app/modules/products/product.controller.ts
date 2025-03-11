import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productService } from "./product.services";


const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const result = await productService.createProductIntoDB(productData);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Product created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { page, limit, search, ...filters } = req.query;
  const {data,meta} = await productService.getAllProductsFromDB(
    Number(page) || 1,
    Number(limit) || 10,
    search as string,
    filters
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "All products retrieved successfully",
    data:data,
    meta:meta
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await productService.getSingleProductFromDB(productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Product retrieved successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const updatedProduct = await productService.updateProductInDB(productId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await productService.deleteProductFromDB(productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Product deleted successfully",
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
