import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";
import slugify from "slugify";

// Create Category
const createCategoryInDB = async (payload: TCategory) => {
  const existingCategory = await Category.findOne({ name: payload.name,isDeleted:false });
  if (existingCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Category with this name already exists");
  }
  const category = await Category.create(payload);
  return category;
};

// Get All Categories
const getAllCategoriesFromDB = async () => {
  const categories = await Category.find({isDeleted:{$ne:true}});
  return categories;
};

// Get Single Category
const getSingleCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }
  if(category.isDeleted===true){
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }
  return category;
};

// Update Category
const updateCategoryInDB = async (id: string, payload: Partial<TCategory>) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }
  if(category.isDeleted===true){
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist')
  }
  
  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true, strict: true });
  }
  const updatedCategory = await Category.findByIdAndUpdate(id, payload, { new: true,runValidators:true });
  return updatedCategory;
};


const deleteCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }

  const result = await Category.findByIdAndDelete(id);
  return result;
};

// Soft Delete Category
const softDeleteCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
  }
  if(category.isDeleted===true){
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not Exist')
  }
  category.isDeleted = true;
  await category.save();
  return category;
};

export const categoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
  softDeleteCategoryFromDB,
};
