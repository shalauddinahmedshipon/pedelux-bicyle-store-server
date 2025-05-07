import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { categoryService } from './category.service';

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const category = await categoryService.createCategoryInDB(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Category created successfully',
      data: category,
    });
  },
);

export const getAllCategories = catchAsync(
  async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategoriesFromDB();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  },
);

export const getCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const category = await categoryService.getSingleCategoryFromDB(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Category retrieved successfully',
      data: category,
    });
  },
);

export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const category = await categoryService.updateCategoryInDB(
      req.params.id,
      req.body,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Category updated successfully',
      data: category,
    });
  },
);

export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await categoryService.deleteCategoryFromDB(req.params.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Category deleted successfully',
      data: result,
    });
  },
);

export const softDeleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const category = await categoryService.softDeleteCategoryFromDB(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      message: 'Category soft deleted successfully',
      data: category,
    });
  },
);

export const categoryController = {
  softDeleteCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  getAllCategories,
  createCategory,
};
